import org.eclipse.rdf4j.model.*;
import org.eclipse.rdf4j.model.impl.SimpleNamespace;
import org.eclipse.rdf4j.model.impl.SimpleValueFactory;
import org.eclipse.rdf4j.query.MalformedQueryException;
import org.eclipse.rdf4j.query.QueryLanguage;
import org.eclipse.rdf4j.query.TupleQuery;
import org.eclipse.rdf4j.query.resultio.sparqljson.SPARQLResultsJSONWriter;
import org.eclipse.rdf4j.repository.Repository;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.repository.RepositoryException;
import org.eclipse.rdf4j.repository.sail.SailRepository;
import org.eclipse.rdf4j.rio.RDFHandler;
import org.eclipse.rdf4j.rio.RDFHandlerException;
import org.eclipse.rdf4j.rio.RDFParseException;
import org.eclipse.rdf4j.rio.RDFParser;
import org.eclipse.rdf4j.rio.helpers.AbstractRDFHandler;
import org.eclipse.rdf4j.rio.jsonld.JSONLDParser;
import org.eclipse.rdf4j.rio.jsonld.JSONLDWriter;
import org.eclipse.rdf4j.rio.ntriples.NTriplesParser;
import org.eclipse.rdf4j.rio.ntriples.NTriplesWriter;
import org.eclipse.rdf4j.rio.rdfxml.RDFXMLParser;
import org.eclipse.rdf4j.rio.rdfxml.RDFXMLWriter;
import org.eclipse.rdf4j.rio.turtle.TurtleParser;
import org.eclipse.rdf4j.rio.turtle.TurtleWriter;
import org.eclipse.rdf4j.sail.nativerdf.NativeStore;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.*;

public class OntologyParser {
    public static void main(String[] args) throws URISyntaxException, IOException {
        // Get configuration values
        final Properties config = new Properties();
        try {
            config.load(new FileInputStream("ontology.properties"));
        } catch (final IOException e) {
            xerr("No ontology.properties file could be loaded.",e);
        }

        // Define known paths
        final Path inputdir = Path.of(config.getProperty("inputdir"));
        final Path outputdir = Path.of(config.getProperty("outputdir"));
        final URI baseurl = new URI(config.getProperty("baseurl"));
        final IRI metauri = SimpleValueFactory.getInstance().createIRI("urn:internal:ontology:meta");

        final Path dbdir = outputdir.resolve("db");
        final Path webdir = outputdir.resolve("web");
        final Path nginxconf = outputdir.resolve("nginx.conf");
        final Path nextdir = outputdir.resolve("next");

        // initialize output directory
        try {
            // Delete any existing output directory
            try {
                Files.walkFileTree(outputdir, new FileVisitor<>() {
                    @Override
                    public FileVisitResult preVisitDirectory(final Path path, final BasicFileAttributes basicFileAttributes) {
                        return FileVisitResult.CONTINUE;
                    }

                    @Override
                    public FileVisitResult visitFile(final Path path, final BasicFileAttributes basicFileAttributes) throws IOException {
                        Files.delete(path);
                        return FileVisitResult.CONTINUE;
                    }

                    @Override
                    public FileVisitResult visitFileFailed(final Path path, final IOException e) {
                        if(e instanceof NoSuchFileException) {
                            return FileVisitResult.CONTINUE;
                        } else {
                            xerr("Failed to delete output files", e);
                            return FileVisitResult.TERMINATE;
                        }
                    }

                    @Override
                    public FileVisitResult postVisitDirectory(final Path path, final IOException e) throws IOException {
                        Files.delete(path);
                        return FileVisitResult.CONTINUE;
                    }
                });
            }
            catch(final NoSuchFileException e) {
                // ignore this exception, directory will get created
            }
            catch(final DirectoryNotEmptyException e) {
                xerr("Output directory must be empty.",e);
            }

            Files.createDirectory(outputdir);
            Files.createDirectory(dbdir);
            Files.createDirectory(webdir);
            Files.createFile(nginxconf);
            Files.createDirectory(nextdir);
        }
        catch (final IOException e) {
            xerr("Cannot initialize output directory.",e);
        }

        // Initialize the database
        final Repository ontologydb = new SailRepository(new NativeStore(dbdir.toFile(),"cspo,spoc,posc"));
        ontologydb.init();

        // Initialize RDF value factory
        final ValueFactory rdf = SimpleValueFactory.getInstance();

        // Initialize Nginx configuration file
        Files.writeString(nginxconf, "http {\n  server {\n    listen 80;\n", StandardOpenOption.APPEND);

        // Initialize linked list for layouts
        final LinkedList<OntologyResource> layouts = new LinkedList<>();

        try(final RepositoryConnection connection = ontologydb.getConnection()) {
            // Traverse and process the input directory
            final FileVisitor<Path> directoryLoader = new SimpleFileVisitor<>() {
                private Deque<OntologyResource> resources = new LinkedList<>();

                @Override
                public FileVisitResult preVisitDirectory(final Path dir, final BasicFileAttributes attrs) throws IOException {
                    // skip 'dot' directories
                    if (dir.toString().contains("/.")) {
                        out(String.format("Skipping dot directory %s", dir));
                        return FileVisitResult.SKIP_SUBTREE;
                    }

                    // create new output directory that mirrors input directory
                    try {
                        Files.createDirectory(webdir.resolve(inputdir.relativize(dir)));
                    } catch (final FileAlreadyExistsException e) {
                        // ignore this
                    }

                    final Path relative = inputdir.relativize(dir);
                    final URI uri = baseurl.resolve(relative.toString());
                    final OntologyResource resource = new OntologyResource(webdir.resolve(relative),rdf.createIRI(uri.toString()));

                    resources.push(resource);
                    layouts.offerFirst(resource);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFile(final Path file, final BasicFileAttributes attrs) throws IOException {
                    // skip 'dot' files
                    if (file.toString().contains("/.")) {
                        out(String.format("Skipping dot file %s", file));
                        return FileVisitResult.CONTINUE;
                    } else {
                        out(String.format("Processing file %s", file));
                    }

                    // get relative path within input directory
                    final Path relative = inputdir.relativize(file);
                    final OntologyResource resource = resources.peek();
                    out(String.format("Current resource is %s",resource));
                    assert resource != null;

                    // Analyze file by extension
                    final RDFParser parser;
                    switch (file.toString().replaceAll("[^.]+\\.", "")) {
                        case "css":
                        case "png":
                        case "jpg":
                        case "jpeg":
                        case "gif":
                        case "webp":
                            out("Processing as static file");
                            Files.copy(file, webdir.resolve(relative));
                            return FileVisitResult.CONTINUE;
                        case "ttl":
                            // parse turtle
                            parser = new TurtleParser();
                            break;
                        case "rdf":
                        case "rdfxml":
                            // parse RDF/XML
                            parser = new RDFXMLParser();
                            break;
                        case "nt":
                        case "ntriples":
                            // parse N-triples
                            parser = new NTriplesParser();
                            break;
                        case "json":
                        case "jsonld":
                            // parse JSON+LD
                            parser = new JSONLDParser();
                            break;
                        case "sparql":
                            try {
                                String name = file.getFileName().toString();
                                name = name.substring(0, name.lastIndexOf('.'));
                                resource.getQueries().putIfAbsent(name, connection.prepareTupleQuery(QueryLanguage.SPARQL, Files.readString(file), baseurl.toString()));
                            } catch (final MalformedQueryException e) {
                                out(String.format("%s is not a valid SPARQL tuple query, ignoring", file));
                            }
                            return FileVisitResult.CONTINUE;
                        case "handlebars":
                        case "hbs":
                            resource.setTemplate(file);
                            return FileVisitResult.CONTINUE;
                        default:
                            // ignore unrecognized file extensions
                            out("Unrecognized file extension, ignoring");
                            return FileVisitResult.CONTINUE;
                    }

                    parser.setRDFHandler(new AbstractRDFHandler() {
                        @Override
                        public void handleNamespace(final String name, final String prefix) {
                            resource.getNamespaces().add(new SimpleNamespace(name, prefix));
                        }

                        @Override
                        public void handleStatement(final Statement st) throws RDFHandlerException {
                            resource.add(st);
                        }

                        @Override
                        public void endRDF() {
                            out(String.format("Added %s RDF triples to %s", resource.size(), resource));
                        }
                    });

                    try {
                        parser.parse(new FileInputStream(file.toFile()), resource.toString());
                        connection.add(resource, resource);
                        connection.commit();
                    } catch (final RDFParseException e) {
                        out("File " + file.toString() + " is not valid syntax for its file extension.");
                        return FileVisitResult.CONTINUE;
                    }

                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFileFailed(final Path file, final IOException e) {
                    e.printStackTrace();
                    return FileVisitResult.TERMINATE;
                }

                @Override
                public FileVisitResult postVisitDirectory(final Path dir, final IOException e) {
                    try {
                        Files.writeString(nginxconf, String.format("    location = /%s { try_files index.html; }\n", inputdir.relativize(dir)), StandardOpenOption.APPEND);
                    } catch (final UnsupportedEncodingException uee) {
                        xerr("This program requires UTF-8 support.", uee);
                    } catch (final IOException ex) {
                        xerr("IO error while attempting to append nginx.conf", ex);
                    }

                    final OntologyResource resource = resources.pop();
                    out(String.format("post-visit %s",resource));

                    // Generate static resource RDF from database
                    if (resource.size() > 0) {
                        // Add resource metadata
                        final BNode bnode = rdf.createBNode();
                        connection.add(rdf.createStatement(bnode, DCTerms.SOURCE, resource, metauri));
                        connection.add(rdf.createStatement(bnode, DCTerms.CREATED, rdf.createLiteral(new Date()), metauri));
                        connection.add(rdf.createStatement(bnode, DCTerms.EXTENT, rdf.createLiteral(resource.size()), metauri));
                        connection.commit();

                        final NTriplesWriter nt;
                        final TurtleWriter ttl;
                        final RDFXMLWriter rdfxml;
                        final JSONLDWriter jsonld;
                        try {
                            nt = new NTriplesWriter(new FileOutputStream(webdir.resolve(inputdir.relativize(dir.resolve("./data.nt"))).toFile()));
                            ttl = new TurtleWriter(new FileOutputStream(webdir.resolve(inputdir.relativize(dir.resolve("./data.ttl"))).toFile()));
                            rdfxml = new RDFXMLWriter(new FileOutputStream(webdir.resolve(inputdir.relativize(dir.resolve("./data.rdf"))).toFile()));
                            jsonld = new JSONLDWriter(new FileOutputStream(webdir.resolve(inputdir.relativize(dir.resolve("./data.jsonld"))).toFile()));
                        } catch (final FileNotFoundException ex) {
                            xerr(String.format("Cannot output serialized resource RDF for <%s> to file", resource), ex);
                            return FileVisitResult.TERMINATE;
                        }
                        connection.prepareGraphQuery(String.format("CONSTRUCT { $s $p $o } WHERE { GRAPH <%s> { $s $p $o } }", resource.stringValue())).evaluate(new RDFHandler() {
                            @Override
                            public void startRDF() throws RDFHandlerException {
                                nt.startRDF();
                                ttl.startRDF();
                                rdfxml.startRDF();
                                jsonld.startRDF();

                                // Handle namespaces
                                for (final Namespace ns : resource.getNamespaces()) {
                                    ttl.handleNamespace(ns.getPrefix(), ns.getName());
                                    rdfxml.handleNamespace(ns.getPrefix(), ns.getName());
                                    jsonld.handleNamespace(ns.getPrefix(), ns.getName());
                                }
                            }

                            @Override
                            public void endRDF() throws RDFHandlerException {
                                nt.endRDF();
                                ttl.endRDF();
                                rdfxml.endRDF();
                                jsonld.endRDF();
                            }

                            @Override
                            public void handleNamespace(final String prefix, final String name) throws RDFHandlerException {
                                nt.handleNamespace(prefix, name);
                                ttl.handleNamespace(prefix, name);
                                rdfxml.handleNamespace(prefix, name);
                                jsonld.handleNamespace(prefix, name);
                            }

                            @Override
                            public void handleStatement(final Statement st) throws RDFHandlerException {
                                nt.handleStatement(st);
                                ttl.handleStatement(st);
                                rdfxml.handleStatement(st);
                                jsonld.handleStatement(st);
                            }

                            @Override
                            public void handleComment(final String comment) throws RDFHandlerException {
                                nt.handleComment(comment);
                                ttl.handleComment(comment);
                                rdfxml.handleComment(comment);
                                jsonld.handleComment(comment);
                            }
                        });
                    }

                    // Propagate layout files
                    if(resource.hasLayout()) {
                        out(String.format("Propagate layout for %s", resource));
                        for (final OntologyResource child : layouts) {
                            if (child.equals(resource)) {
                                break;
                            } else {
                                out(String.format("Propagating to child %s", child));
                                child.setTemplate(resource.getTemplate());
                                for (final Map.Entry<String, TupleQuery> query : resource.getQueries().entrySet()) {
                                    child.getQueries().putIfAbsent(query.getKey(), query.getValue());
                                }
                            }
                        }
                    } else {
                        out(String.format("No layout to propagate for %s",resource));
                    }

                    return FileVisitResult.CONTINUE;
                }
            };

            try {
                Files.walkFileTree(inputdir, directoryLoader);
                Files.writeString(nginxconf, "  }\n}", StandardOpenOption.APPEND);
            } catch (final IOException e) {
                xerr("Error while traversing input directory.", e);
            }

            // Do template processing
            for(final OntologyResource resource : layouts) {
                if(resource.getTemplate() == null || resource.size() == 0) {
                    out(String.format("Skipping layout for %s",resource));
                    continue;
                }
                out(String.format("Processing layout for %s",resource));
                Files.copy(resource.getTemplate(),resource.getPath().resolve(resource.getTemplate().getFileName()));
                for(final Map.Entry<String,TupleQuery> query : resource.getQueries().entrySet()) {
                    out(String.format("Executing query %s",query.getKey()));
                    query.getValue().setBinding("resource",resource);
                    query.getValue().evaluate(new SPARQLResultsJSONWriter(new FileOutputStream(resource.getPath().resolve(String.format("%s.jsonrq",query.getKey())).toFile())));
                }
            }
        } catch(final RepositoryException e) {
            xerr("Database error occurred during processing.",e);
        }
    }

    private static void out(final String message) {
        System.out.println(message);
    }

    private static void err(final String message) {
        System.err.println(message);
    }

    private static void xerr(final String why, final Exception e) {
        err(why);
        e.printStackTrace();
        System.exit(1);
    }
}

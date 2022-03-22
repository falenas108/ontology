import org.eclipse.rdf4j.model.IRI;
import org.eclipse.rdf4j.model.Namespace;
import org.eclipse.rdf4j.model.Statement;
import org.eclipse.rdf4j.model.impl.SimpleValueFactory;
import org.eclipse.rdf4j.query.TupleQuery;

import java.nio.file.Path;
import java.util.*;

public class OntologyResource extends LinkedList<Statement> implements IRI {
    private IRI iri;
    private Set<Namespace> namespaces = new HashSet<>(8);
    private final Path path;
    private Path template = null;
    private final Map<String, TupleQuery> queries = new HashMap<>(16);

    OntologyResource(final Path path, final IRI iri) {
        this.path = path;
        this.iri = iri;
    }

    @Override
    public boolean isBNode() {
        return false;
    }

    @Override
    public boolean isIRI() {
        return true;
    }

    @Override
    public boolean isLiteral() {
        return false;
    }

    @Override
    public boolean isTriple() {
        return false;
    }

    @Override
    public String getNamespace() {
        return this.iri.getNamespace();
    }

    public IRI getIRINamespace() {
        return SimpleValueFactory.getInstance().createIRI(this.getNamespace());
    }

    @Override
    public String getLocalName() {
        return this.iri.getLocalName();
    }

    @Override
    public String stringValue() {
        return this.iri.stringValue();
    }

    @Override
    public String toString() {
        return this.iri.stringValue();
    }

    public Set<Namespace> getNamespaces() {
        return this.namespaces;
    }

    public void setTemplate(final Path template) {
        if (this.template == null) {
            this.template = template;
        }
    }

    public Path getTemplate() {
        return template;
    }

    public Map<String,TupleQuery> getQueries() {
        return queries;
    }

    public Path getPath() {
        return path;
    }

    public boolean hasLayout() {
        return this.template != null || !this.queries.isEmpty();
    }

    @Override
    public boolean equals(final Object o) {
        if(o instanceof OntologyResource) {
            return ((OntologyResource)o).iri.equals(iri);
        } else {
            return false;
        }
    }
}

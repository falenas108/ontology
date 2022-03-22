import fs from 'fs';
import { processSparql } from './processSparql.js';
import { SparqlSimplified } from './sparql.js';
import Handlebars from 'handlebars';

interface Layouts {
  [path: string]: {
    template?: string;
    data: { [query: string]: SparqlSimplified };
  };
}

const INPUTDIR = '/home/heather/ontology/output/web';

const layouts: Layouts = { [INPUTDIR]: { data: {} } };
const generateLayouts = (dir: string) => {
  const contents = fs.readdirSync(dir);
  contents.forEach((item: string) => {
    const path = dir + '/' + item;
    const stat = fs.statSync(path);
    if (stat.isDirectory()) {
      layouts[path] = { data: {} };
      generateLayouts(path);
    } else if (stat.isFile()) {
      const { name, extension } = getFileParts(item);
      switch (extension) {
        case 'jsonrq':
          layouts[dir].data[name] = processSparql(
            JSON.parse(fs.readFileSync(path).toString())
          );
          break;
        case 'handlebars':
        case 'hbs':
          layouts[dir].template = fs.readFileSync(path).toString();
          break;
      }
    } else {
      console.warn(`Unknown file type for ${path}`);
      return;
    }
  });
};

const getFileParts = (filename: string) => {
  const i = filename.lastIndexOf('.');
  if (i === -1) {
    return { name: filename };
  }
  return {
    name: filename.substring(0, i),
    extension: filename.substring(i + 1),
  };
};

generateLayouts(INPUTDIR);

Object.entries(layouts).forEach(([path, layout]) => {
  if (layout.template) {
    fs.writeFileSync(
      `${path}/layout.html`,
      Handlebars.compile(layout.template)(layout.data)
    );
  }
});

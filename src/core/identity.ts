// Q: WASSUP WITH THIS IDENTITY THING
// A: THe concern I have is that the drag-and-drop, domain specific IDs may collide. For instance, if my data source has similarly named but differently typed objects, graphql may be screwed.
//  Let's say I have /datasource/actor/garfield for Andrew Garfield, and /datasource/characters/garfield for the lasagna destroying feline, querying for garfield may be a problem. 
//  To solve this, we make a unique ID using the file system. Since all file names are unique, we can normalize the file name and path as the UID for the whole of our KMS
import path from 'path';

export function buildKmsId(params: {
  rootDir: string;
  filePath: string;
}) {
  const relativePath = path
    .relative(params.rootDir, params.filePath)
    .replace(/\.[^/.]+$/, '') // remove extension
    .replace(/\\/g, '/');     // Windows safety

  return normalizeKmsId(relativePath);
}

function normalizeKmsId(p: string) {
  return p
    .split('/')
    .filter(Boolean)
    .join('/');
}
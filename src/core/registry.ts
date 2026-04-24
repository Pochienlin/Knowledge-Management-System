export type GraphNode = {
  kmsId: string;
  domainId?: string;
  __type: string;
  __filePath: string;
  [key: string]: any;
};

export class Registry {
  private nodes = new Map<string, GraphNode>();

  // Store a node
  add(node: GraphNode) {
    if (this.nodes.has(node.kmsId)) {
      throw new Error(`Duplicate kmsId detected: ${node.kmsId}`);
    }

    this.nodes.set(node.kmsId, node);
  }

  // Get single node
  get(kmsId: string): GraphNode | undefined {
    return this.nodes.get(kmsId);
  }

  // Get all nodes of a type
  getByType(type: string): GraphNode[] {
    return Array.from(this.nodes.values()).filter(
      n => n.type === type
    );
  }

  // Get everything (useful for debugging / resolvers)
  getAll(): GraphNode[] {
    return Array.from(this.nodes.values());
  }
}
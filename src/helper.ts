
export function getConfig(config, RED: any, node?: any, msg?: any) {
    return {
        context: RED?.util.evaluateNodeProperty(node.context, node.contextType, node, msg),
        namespace: RED?.util.evaluateNodeProperty(node.namespace, node.namespaceType, node, msg),
        body: RED?.util.evaluateNodeProperty(node.body, node.bodyType, node, msg),
        action: RED?.util.evaluateNodeProperty(node.action, node.actionType, node, msg),
        kubeconfig: JSON.parse(config.kubeconfig),
        path: config.path
    }
    //kubeconfig: {},

}
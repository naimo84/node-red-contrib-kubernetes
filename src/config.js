module.exports = function (RED) {
    

    function icalConfig(config) {
        RED.nodes.createNode(this, config);

      

        this.name = config.name;
        this.kubeconfig = config.kubeconfig;
        this.path = config.path;

       
    }

    RED.nodes.registerType('k8s-config', icalConfig);
};

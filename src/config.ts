module.exports = function (RED: any) {
    

    function icalConfig(config) {
        RED.nodes.createNode(this, config);

      

        this.name = config.name;
        this.kubeconfig = config.kubeconfig;

       
    }

    RED.nodes.registerType('k8s-config', icalConfig);
};

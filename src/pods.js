const  getConfig = require( 'node-red-contrib-kubernetes/src/helper');
const k8s = require('@kubernetes/client-node');
const { join } = require('path');

module.exports = function (RED) {
    function node(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.red = RED;
        node.msg = {};

        node.on('input', (msg, send, done) => {
            msg = RED.util.cloneMessage(msg);
            send = send || function () { node.send.apply(node, arguments) }
            onInput(node, getConfig(RED.nodes.getNode(n.kubeconfig), RED, n, msg), msg, send, done);
        });
    }

    async function onInput(node, config, msg, send , done) {
        try {
            const kc = new k8s.KubeConfig();
            kc.loadFromFile(config.path || join(__dirname, 'kubeconfig'));
            kc.setCurrentContext(config.context);
            const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

            if (!config.action || config.action === "list") {
                const res = await k8sApi.listNamespacedPod(config.namespace)
                send(Object.assign(msg, {
                    payload: res.body
                }));
            } else if (config.action === "create") {
                try {
                    const res = await k8sApi.createNamespacedPod(config.namespace, config.body)
                    console.log(res);
                    send(Object.assign(node.msg, {
                        payload: res.body
                    }));
                } catch(err) {
                    console.log(err);
                    
                    send(Object.assign(node.msg, {

                    }));
                }
            } else if (config.action === "delete") {
                try {
                    const res = await k8sApi.deleteNamespacedPod(config.body.metadata.name, config.namespace)
                    send(Object.assign(node.msg, {
                        payload: res.body
                    }));
                } catch {
                    send(Object.assign(node.msg, {

                    }));
                }
            }

            if (done) {
                done();
            }
        }
        catch (err) {
            node.status({ fill: 'red', shape: 'ring', text: err.message });
            //@ts-ignore
            send({ error: err });
            if (done) {
                done(err);
            } else {
                node.error(err, msg);
            }
        };
    }


    RED.nodes.registerType('k8s-pods', node);
};

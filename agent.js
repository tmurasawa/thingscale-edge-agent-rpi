const mqtt  = require('mqtt')
const log   = require('winston')
const childProcess = require('child_process');
const si = require('systeminformation');
//var unescapeJs = require('unescape-js')
var util = require('util')
var config = require('config')
//var HashMap = require('hashmap');
//var events = require('events')
//var notifyEmitter = new events.EventEmitter()

const log_level = process.env.LOG_LEVEL || 'debug'
const scanInterval = 5;

const mqtt_baseTopic    = process.env.MQTT_BASE_TOPIC || config.device_token + '/state'
const mqtt_url          = process.env.MQTT_URL ||'mqtt://m.thingscale.io:1883'
const mqtt_config       = {
                            username: process.env.MQTT_USERNAME || config.user_id,
                            password: process.env.MQTT_PASSWORD || config.device_token,
                        }

const device_id   = config.device_id
const mqtt_subTopic    = process.env.MQTT_BASE_TOPIC || config.device_token + device_id + '/subscribe'

var count = 0;
var mqtt_flag = true;
var loop = 0;
var current_load = 0;
var pod_run_current = 0;
var uptime = 0;
var health = "";

/* eventlimitter */
setInterval(function() {
// 1count=const(scanInterval) count<1 means 6sec interval, count<2 means 12sec interval...ex)set 4 equal 15sec interval
    if (count < 0) {
  mqtt_flag = false;
      count = count + 1;
  }
  else {
    mqtt_flag = true;
  } 

    if(mqtt_flag) {
      si.currentLoad()
	    .then(data => {
		    current_load = data.currentload;
	    })
	    .catch(error => console.error(error));

	childProcess.exec('kubectl get pod --all-namespaces |grep Running | wc -l', (error, stdout, stderr) => {
  	if(error) {
    		console.log(stderr);
    		return;
  	}
  	else {
    		console.log("Running pods:" + stdout);
		pod_run_current = stdout;
  	}
	});

      if(current_load > 70) {
	health = "WARN";
      }
      else {
	health = "OK";
      }

      var finalPayload = "health=" + health + "&load=" + current_load + "&pod_run_current=" + pod_run_current + "&uptime=" + si.time().uptime;
      console.log(finalPayload);
      mqttClient.publish(`${mqtt_baseTopic}/${device_id}`,finalPayload)
      count = 0;
      loop = 0;
      stackPayload = '';
    }
}, scanInterval * 1000)

/*
    mqtt callbacks 
*/

onMqttMessage = (topic, message) => {
    log.debug('MQTT topic: '+ mqtt_subTopic +' message: ' + message.toString())
    }
/* mqtt connect */
onMqttConnect = () => { log.info('MQTT connected') }

/* main */
log.level = log_level

const mqttClient = mqtt.connect(mqtt_url, mqtt_config)

mqttClient.on('connect', onMqttConnect)
mqttClient.on('message', onMqttMessage)
mqttClient.subscribe(mqtt_subTopic,{qos:1});

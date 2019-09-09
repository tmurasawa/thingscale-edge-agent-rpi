# thingscale-edge-agent-rpi
ThingScale edge agent is an agent that monitors raspi health from ThingScale Cloud.

# Available items
* Processor uptime(sec): = systeminformation si.time().uptime
* Processor load(%): = systeminformation si.currentLoad(cb).currentload
* Number of k3s's running pod: = kubectl get pod --all-namespaces | grep Run | wc -l)

# Quick Start
## for none-docker/k3s
### prerequisite:
* Installing k3s <https://k3s.io>

### Download agent and installing libraries  

```
cd <WORK_DIR>
git clone https://github.com/tmurasawa/thingscale-edge-agent-rpi.git
npm install mqtt winston util systeminformation config
mkdir config ; cd config
vi default.json
(add credentials of ThingScale)
cd ..
```

Sample of default.json

```
{
"device_id":"<device_id>",
"user_id":"<thingscale_userid (ex:U000***)>",
"device_token":"<device_token (32bit hexadecimal token)"
}
```
   
### Run agent  
`node agent.js & > /dev/null`

All done! have a fun.


## for docker
### Pulling agent and run
```
docker pull tmura6781/thingscale-edge-agent-rpi:latest
docker images|grep thingscale
docker run -d -e DEVICE_ID=<device_id> -e USER_ID=<thingscale_user_id> -e <device_token> tmura6781/thingscale-edge-agent-rpi:latest
```

All done! have a fun.


# Acknowledgement
Confirmed environment:  
* Raspbian GNU/Linux 10 (buster)
* k3s version v0.8.1

Health value condition:  
* Processor load <= 70% ; "OK"
* Processor load > 70% : "WARN"

How can I get heath itmes?  
You can access /v2/device/<device_id> from ThingScale REST API.  
REST response body is below:  
```
[
    {
        "device_id": "k3s",
        "description": "k3s",
        "enabled": true,
        "mapped_ch": 5,
        "device_type": "Raspi3",
        "location": "",
        "manufacturer": "",
        "activate_at": "2019-09-06T19:01:38+09:00",
        "state": {
            "uptime": 250036,
            "load": 5.96473,
            "pod_run_current": 3,
            "health": "OK",
            "last_update": "2019-09-09T16:05:27+09:00"
        }
    }
```

Other notes and limitations:
* When the device status is disable,you can not update the state.
* When the device is not map the channel,you can not update the state.
* Default update interval is 30sec. Please Do not specify a smaller value.


# TODO
* Allow remote reboot
* Allow remote GPIO control
* Docker image


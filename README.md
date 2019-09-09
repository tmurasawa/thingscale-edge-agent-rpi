# thingscale-edge-agent-rpi
ThingScale edge agent is an agent that monitors raspi health from ThingScale Cloud.

# Quick Start
## for none-docker
prerequisite

    cd <WORK_DIR>
    git clone https://github.com/tmurasawa/thingscale-edge-agent-rpi.git
    npm install mqtt winston util systeminformation config
    mkdir config ; cd config
    vi default.json
    (add credentials of ThingScale)
   
Run agent
`node agent.js > /dev/null`


## for docker

## for k3s

# Acknowledgemenkt


# TODO


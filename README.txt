info to watch
- temps - cpu, gpu, mb, hdd?
- cpu, gpu utilisation
- hdd space
- system errors
- system responsive up time? http://www.winhelponline.com/blog/incorrect-uptime-taskmgr-wmi-refresh/
- network up time - https://github.com/Financial-Times/node-health-check/blob/master/lib/check/tcp-ip.js?
- anti virus - avira - updates, scans.
- general info - systeminfo, os, others?

data sources
- systeminformation
- openhardwaremonitor (wmi)
- coretemp
- node os?
- others...

- second service required to monitor up time?

data aggregation
- min, max, avg, total, delta (change)

notification
- limits
- general reports schedules
- mediums - sms (https://github.com/mediaburst/node-clockwork), email

- web portal (push notifications)
- web api
- push reports
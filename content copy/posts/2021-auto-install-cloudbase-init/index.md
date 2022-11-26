---
title: "Auto Install Cloudbase-Init"
date: 2021-06-03T11:27:40+02:00
tags : [cloud-init, cloudbase-init, vsphere, packer, automation, vRealizs Automation]
draft: false
thumbnail: "images/jonathan-hanna-xgdsC0tRsPc-unsplash.jpg"
#images: 
#- "images/jonathan-hanna-xgdsC0tRsPc-unsplash.jpg"
description: "How to automaticly install Cloudbase-Init onto Windows VM's using packer, with a configuration that works with vSphere and vRealize Automation"
---
Ever since [vRealize Automation 8](https://www.vmware.com/products/vrealize-automation.html) was released, and we started using [Cloud-Init](https://cloudinit.readthedocs.io/en/latest/#), I have been looking at installing [CloudBase-Init](https://cloudbase.it/cloudbase-init/) for Windows as well, as part of my automated [Packer](https://www.packer.io) template deployment.

While Cloud-Init on Linux, is dead simple to install, the Windows version, has given me a lot of problems.

Until a couple of weeks ago, where I got the solution from my collegaue [Steffen Moen](https://www.linkedin.com/in/steffenmoen/), who had found a way to do it manualily.

I quickly got it automated, so it's now part of my Packer deployment of Windows machines.

I won't go into details on how to create a Packer deployment, of a Windows machine. There are lot's of others, that has done this already.
If you are looking for inspiration, then I highly recommend, to take a look at my good collegaue Michael Poore's [blog series](https://blog.v12n.io/creating-vsphere-vm-templates-with-packer-part-1/), around this.

I will only focus on the config files, and the script to make it work.

### The config files

There are 2 config files, that needs to be in a location, where you can copy them to Windows.
In packer, I have mine in a script folder, that is then mountet as a A:/ drive.

cloudbase-init-unattend.conf

```
[DEFAULT]  
username=Administrator  
groups=Administrators  
inject_user_password=true  
config_drive_raw_hhd=true  
config_drive_cdrom=true  
config_drive_vfat=true  
bsdtar_path=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\bin\bsdtar.exe  
mtools_path=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\bin\  
verbose=true  debug=true  
log-dir=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\log\  
log-file=cloudbase-init-unattend.log  
default_log_levels=comtypes=INFO,suds=INFO,iso8601=WARN,requests=WARN  
logging_serial_port_settings=  
mtu_use_dhcp_config=true  
ntp_use_dhcp_config=true  
local_scripts_path=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\LocalScripts\  
metadata_services=cloudbaseinit.metadata.services.ovfservice.OvfService  
plugins=cloudbaseinit.plugins.common.mtu.MTUPlugin,cloudbaseinit.plugins.common.sethostname.SetHostNamePlugin,cloudbaseinit.plugins.windows.extendvolumes.ExtendVolumesPlugin  
allow_reboot=false  
stop_service_on_exit=false  
check_latest_version=false
```

cloudbase-init.conf

```
[DEFAULT]
username=Administrator
groups=Administrators
inject_user_password=true
config_drive_raw_hhd=true
config_drive_cdrom=true
config_drive_vfat=true
bsdtar_path=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\bin\bsdtar.exe
mtools_path=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\bin\
verbose=true
debug=true
log-dir=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\log\
log-file=cloudbase-init.log
default_log_levels=comtypes=INFO,suds=INFO,iso8601=WARN,requests=WARN
logging_serial_port_settings=
mtu_use_dhcp_config=true
ntp_use_dhcp_config=true
local_scripts_path=C:\Program Files\Cloudbase Solutions\Cloudbase-Init\LocalScripts\
check_latest_version=true
first_logon_behaviour=always
metadata_services=cloudbaseinit.metadata.services.ovfservice.OvfService
plugins=cloudbaseinit.plugins.windows.createuser.CreateUserPlugin,cloudbaseinit.plugins.windows.setuserpassword.SetUserPasswordPlugin,cloudbaseinit.plugins.common.sshpublickeys.SetUserSSHPublicKeysPlugin,cloudbaseinit.plugins.common.userdata.UserDataPlugin,cloudbaseinit.plugins.common.localscripts.LocalScriptsPlugin
```

### Script

I also have a script file, that

- Downloads the installation file from [Github](https://github.com/cloudbase/cloudbase-init/releases)
- Installs Cloudbase-Init
- Copys the config files, to Windows.
- And then runs a sysprep.

cloudbase.ps1

```
# download installer
$client = new-object System.Net.WebClient
$client.DownloadFile("https://github.com/cloudbase/cloudbase-init/releases/download/1.1.2/CloudbaseInitSetup_1_1_2_x64.msi", "C:\windows\temp\CloudbaseInitSetup_Stable_x64.msi" )

# install Cloudbase-Init
start-process -FilePath 'c:\Windows\temp\CloudbaseInitSetup_Stable_x64.msi' -ArgumentList '/qn /l*v C:\windows\temp\cloud-init.log' -passthru | wait-process

# Move conf files to Cloudbase directory
move-item a:/cloudbase-init.conf "C:\Program Files\Cloudbase Solutions\Cloudbase-Init\conf\cloudbase-init.conf" -force
move-item a:/cloudbase-init-unattend.conf "C:\Program Files\Cloudbase Solutions\Cloudbase-Init\conf\cloudbase-init-unattend.conf" -force

# Run sysprep
start-process -nonewwindow -FilePath "C:/Windows/system32/sysprep/sysprep.exe" -ArgumentList "/generalize /oobe /unattend:C:\progra~1\cloudb~1\cloudb~1\conf\Unattend.xml" -wait
```

Note I do not power off the VM, after the sysprep is finished, since I let Packer do that.

But that is all it takes.

For me, I use Cloudbase-Init to set hostname, on my VM, and to install the [Salt Minion](https://docs.saltproject.io/en/latest/ref/cli/salt-minion.html), so do further configuration, when I deploy using vRealize Automation.

I have added an example, on how the Cloudbase part of the Cloud Template, could look like below.

```
cloudConfig: |
#cloud-config
    set_hostname: '${self.resourceName}'
    runcmd:
    - start /B /wait c:\salt\salt-minion.exe /S /minion-name='${self.resourceName}' /start-service=1
    - start /B /wait salt-call grains.set baseline "${input.baseline}"
    - start /B /wait salt-call state.apply
```

Photo by <a href="https://unsplash.com/@funnelhead?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jonathan Hanna</a> on <a href="https://unsplash.com/s/photos/dials?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
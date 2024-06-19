+++
title = 'Restic backups via SFTP to Synology NAS'
date = 2021-06-13T19:41:29+02:00
tags = ['restic','backup','nas']
+++

I had an old NAS lying around and some free time during my holidays which resulted in the attempt below to get backups working with restic. I already used [restic](https://restic.readthedocs.io/) previously together with a [minio](https://min.io/) storage backend.

Sources:

- [restic documentation](https://restic.readthedocs.io/en/stable/index.html)
- [blogpost on aaronlenoir.com](https://blog.aaronlenoir.com/2018/05/06/ssh-into-synology-nas-with-ssh-key/)

Hardware:

- Synology DiskStation DS214

Software:

- DSM 6.2.4-25556

## Enable the SSH server

Login to your disk station via the browser UI and navigate to Control Panel -> Terminal & SNMP -> Terminal to enable the SSH service. Apply the settings and you can already login via ssh using your password.

To allow to login with ssh keys, edit the configuration under `/etc/ssh/sshd_config` and uncomment the following lines:

```
#PubkeyAuthentication yes
#AuthorizedKeysFile  .ssh/authorized_keys
```

Restart the ssh service using `sudo synoservicectl --reload sshd`.

## Add you SSH key

In order to be able to add you ssh key, you have to create the necessary folder structure since synology does not prepare a home directory for you.

```bash
# login
ssh ${SYNOLOGY_USERNAME}@${SYNOLOGY_IP_ADDRESS}

# setup the folder structure
sudo mkdir -p /var/services/homes/${USER}/.ssh
sudo chown -R ${USER}:${GROUP} /var/services/homes/${USER}

# create the file and add you ssh key
vim /var/services/homes/${USER}/.ssh/authorized_keys
```

Now you should be able to login without needing to enter the password.

## Setup restic repository using SFTP

First, you need to enable the SFTP file service on the synology box. Navigate to Control Panel -> File Service -> FTP and enable SFTP at the bottom. Next up, you have to setup a folder for your backups. Add the folder backup in the Control Panel -> Shared Folder and make sure that you have the necessary permissions to read / write. In my case, the backup folder is visible under `/volume1/backup`. Note that the `volume1` part is not needed (and it does not work when you include it). You can find some hints regarding this [here](https://github.com/restic/restic/issues/596).

TL;DR: enable SFTP, use sft on the CLI to find the correct path:

```bash
# check where you will land and use this path when
# initialising your repository

sft ${SYNOLOGY_USERNAME}@${SYNOLOGY_IP_ADDRESS}
> ls

# the result is the path that you want!
```

Once you have the path, you can init the repository and set a password for it.

```bash
# setup the repository
restic -r sftp:${SYNOLOGY_USERNAME}@${SYNOLOGY_IP_ADDRESS}:/backup init
```

## Backup folders

Using the same argument, you now are able to run backups. You can find out more about the backup command here.

```bash
restic \
  -r sftp:${SYNOLOGY_USERNAME}@${SYNOLOGY_IP_ADDRESS}:/backup \
  --verbose backup ~/Documents
```

All that is left now is to run it on a regular basis. This keeps changes to a minimum and therefore reduces the time it takes to run a backup. It also makes sure that if something happends to a file, the difference to the last backup is minimal.

Note that to automate it you can use environment variables to provide the passwords. For example, the variable `RESTIC_PASSWORD_FILE` to specify the path to a file with the password for the repository in it. This allows you to fully automate the jobs without the need to provide the passwords in plaintext in for example the cron job.

Happy backing-up!


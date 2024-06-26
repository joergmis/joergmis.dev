+++
title = 'Adding a Gopass Recipient'
date = 2020-12-27T19:41:29+02:00
tags = ['gopass']
+++

Gopass is a rewrite of pass in go. For more information, check out their [documentation](https://www.gopass.pw/docs/).

Prerequisites:

- tools: git, gpg2, gopass
- a gpg2 key pair
- access to the repository with the secrets
- co-worker which has also access to the repository (write permissions)

To be able to read / write secrets, you need a gpg2 key. The following command walks you through the necessary steps.

```bash
gpg2 --full-gen-key
```

Afterwards, export your (public) key and ownertrust. Replace `$YOUR_NAME` with the name you used during the setup.

Note: ownertrust seems to be needed in order for the other person to be able to read the user id (uid).

```bash
gpg2 -a --export $YOUR_NAME > gopass_key.pub.asc
gpg2 --export-ownertrust > trust.txt
```

Your co-worker now has to import the ownertrust and your key as well as lsign and trust your key.

```bash
gpg2 --import-ownertrust trust.txt
gpg2 --import gopass_key.pub.asc
```

For trusting and signing your key, you need the key ID which you can find with `gpg2 --list-keys`. Replace `$KEY_NAME` with the ID you found.

```bash
gpg2 --edit-key $KEY_NAME
< ... > 
lsign
< ... > 
trust
< ... >
save
```

Now all that is left is for your co-worker to actually add you as a gopass recipient: `gopass recipient add`, select your key, approve and run `gopass sync`.

You still have to clone the repository and do the same with every key in the `~/.password-store/.public-keys` folder. Then you are good to go.

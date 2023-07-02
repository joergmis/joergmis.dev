---
title: 'D-Link N Nano driver setup'
excerpt: 'Running a D-Link N Nano adapter with Fedora.'
date: '2020-12-26'
---

I recently switched to void linux where the D-Link N Nano wireless adapter does not work out of the box. I had the same issue a year ago when I installed fedora 30 on the same machine but did not remember how I solved it until I came across the same repository again: [Mange/rtl8192eu-linux-driver](https://github.com/Mange/rtl8192eu-linux-driver).

To make sure that I don’t spend time on it again, I wanted to make a note for myself. The problem is that the usb adapter is recognized but can’t authenticate itself despite having the correct credentials. It does not work with any access point: android phone, ios or the default access point in my apartment.

The device information:

```
lsusb
< ... > 
Bus 001 Device 002: ID 2001:3319 D-Link Corp. Wireless N Nano USB Adapter
< ... > 
```

After some digging I found the github repo mentioned above and while writing this post also [this medium article](https://medium.com/%2540leandroembu/rtl8192eu-wireless-adapter-on-void-linux-dafc295c6e67). After using the driver from the repo, it worked flawlessly.
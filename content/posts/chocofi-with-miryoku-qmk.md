+++
title = 'Chocofi with Miryoku Keyboard Layout'
date = 2024-06-22T23:17:21+02:00
tags = ['keyboard', 'qmk', 'layout', 'miryoku', 'chocofi', 'zmk', 'crkbd']
+++

I recently bought a [chocofi](https://shop.beekeeb.com/product/presoldered-chocofi-split-keyboard/) with sea-picros which doesn't seem the most popular choice - [zmk](https://github.com/zmkfirmware/zmk) supports wireless builds but not wired builds. Both zmk and qmk also don't have a specific chocofi target - which lead to some digging around.

{{< figure src="chocofi_table.jpg" title="Chocofi keyboard on a wooden table" >}}

Specs:

- controller: sea-picro
- plate/case: black pla
- key switch: silent linear
- keycap: mbk legend white on gray

I started with the `sea-picro` and found the [documentation](https://joshajohnson.com/sea-picro/#documentation) online. The important excerpt from it:

> As Sea-Picro has the same pinout as the RP2040 Pro Micro, we can use the promicro_rp2040 converter to remap the pins.

The second hint was from [a blog post from devctrl](https://devctrl.blog/posts/the-definitive-guide-to-qmk-compiling-and-flashing-chocofi-with-sea-picro-rp2040/); it is mentioned that you can use the corne keyboard (also known as crkbd).

This means that we have all the information to build the qmk firmware (I decided to go with the Miryoku layout for starters). Follow the steps [described in the miryoku repo](https://github.com/manna-harbour/miryoku_qmk/tree/miryoku/users/manna-harbour_miryoku) to setup/update the branches. Then, to compile the firmware, run:

```bash
make clean \
  crkbd:manna-harbour_miryoku:uf2 \
  CONVERT_TO=rp2040_ce \
  MIRYOKU_ALPHAS=QWERTZ
```

Note that the switches out the alpha layer for QWERTZ. This is mainly due to the fact that my workflow includes many vim focused tools which use 'hjkl' to navigate. While in nvim it would be easily possible to adjust the keymappings, it's hard to adjust it in all other tools to have a consistent experience. That's why I decided to go for the QWERTZ layout for the moment.

This also means that at least the normal character typing speed shouldn't be impacted as much compared to if I would switch to a whole new layout.

To flash the keyboard:

- start with one keyboard half and plug it in
- press the reset button > 1s
- the keyboard should pop up as a device (something like `RPI-RP2`)
- drag the `*.uf2` to the device
- the keyboard should automatically reboot and start reacting to keypresses
- repeat with the second half

And you are good to go! Although in the future I would like to switch to zmk. [There are already a few open issues](https://github.com/zmkfirmware/zmk/pulls?q=is%3Apr+is%3Aopen+wired+split+) regarding wired split support; maybe one of them will be finished soon.

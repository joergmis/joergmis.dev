---
title: "Cloud Computing Concepts"
date: "2021-10-05"
lastmod: "2021-10-05"
author: "joergmis"
type: "zettel"
tldr: ""
tags:
- "@softwareengineering"
- "@cloudcomputing"
- "@theory"
- "@codinginterview"
toc: yes
---

## Intro

The promise of cloud computing is simple - optimise *total cost of ownership (toc) = capital expenses (capex) + operational expenses (opex)*. For this, cloud computing needs to adhere to the following principles (see also NIST definition):

- on demand & self-service -> ability to spin up a VM without an admin
- multi-tenancy -> resources are shared with others
- elasticity -> ability to scale rapidly
- metered -> pay as you go

Depending on the value you provide, you can rely on differnt services:

- software as a service (SAAS)
- platform as a service (PAAS)
- infrastructure as a service (IAAS)

The differences are what resources you control - some SAAS does not provide access to network configuration settings, IAAS does not support you with database outages.

## Basics

### Virtualization

There are two types of virtualization:

- type 1 ("baremetal hypervisor"): hardware + virtual machine monitor + guest operating system
- type 2: hardware + host operating system + virtual machine monitor + guest operating system

*Environments created by a VMM have the following properties:*

- quivalence: the behaviour inside the VMM is no different from behaviour when running on the native OS
- resouce control: VMM is in complete control of the virtualized resources
- efficiency: a dominant fraction of machine instructions are executed without VMM intervention

### Containers

In contrast to the virtualization, containers don't provide their own kernel - they use the kernel of the OS. They provide libraries that are not provided by the host OS -> provide a reproducible environment.

## Cloud native applications

### Lifecycle

- design of the architecture
- implementation
- deployment -> setup of resources and dependencies
- provisioning -> activation, make it accessible for the user
- operation and runtime management -> scaling, reconfiguration
- disposal -> teardown of resources and dependencies but also how it will be replaced

### Characteristics

- architecture: needs to be designed for scalability and resilience ("assume nothing")
  - move towards service oriented architecture (SOA)
  - use specific patterns
- organization: reorganize teams (see conway's law)
  - agile teams around business capabilities
  - incorporate devops principles
- process: adapt tools and technologies
  - automation of software testing and deployment

### Service oriented architecture

The goal is to support a thinking in terms of services: self contained units of functionality that can be accessed from remote.

- standardized protocols
- abstraction from implementation
- loose coupling
- reusability
- composability
- stateless services -> allow for easy scaling
- discoverable services

Compared to the monolith, only the neccessary services have to be scaled under load. And since they are decoupled from other services, they can evolv separatly.

### 12 factor apps

- service registry
  - keep track where / how services are reachable
  - keep track of the state of instances
- circuit breaker
  - standardized exception handling
  - limit spamming if a service is unavailable
  - provides the possibility for the caller to react if a service is down
- load balancer: distribute load to parallel running instances
- api gateway
  - provide one unified, consistent way for customers to interact with the system
- endpoint monitoring
  - track state / metrics of services such as response code / time / ...
- queue load-leveling
  - level the load with a queue or a bucket -> easier to predict, less spikes
- health management
  - check if a service is operational
  - check if the desired amount of endpoints is up
- event-sourcing
  - track state changes in database
  - allows to recreate the same state of the application
- competing consumers / producers
  - decouple consumer / producer with a queue
  - consumer does not need to know who / where the producer is
- command query response segregation
  - separate paths for different operations such as read / write
  - overload on one path does not influence other path

## Sources

- [NIST definition of Cloud Computing](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-145.pdf)
- [12 Factor App](https://12factor.net)
- CCP course @ ZHAW
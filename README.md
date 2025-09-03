# EnergeX Sample

## Overview

I didn't get through all the points, but hopefully made it through enough
to demonstrate overall familiarity. I assumed the underlying reason for making
both a PHP and a node based service effectively serving the same info was to
see if we're familiar with microservice style deployments. So instead of
paying a lot of attention to the caching itself I made sure the JWT tokens
were owned by PHP and node was just a a consumer of tokens and a readonly
client. I could have dug into something like cache invalidation using redis
pub/sub on database updates, but I figured the auth handling might be a better
demonstration.

The dockerization is another spot I figured the real interest was in getting
to a workable practical that serves as a good deployment test. So I also put
in a build for the React client and serve it out of a container to make
everything encapsulated. And put in the bits to handle timing issues, like the
ready check for mysql to make sure Laravel can run migrations when it comes up
instead of leaving it up to chance.

Hopefully it aligns with the intended test, but I used a bunch of AI tools in
putting this together. Primarily Claude Code and ChatGPT for general
questions. But I also tried as much as possible to in double check and correct
for issues instead of just dumping in exactly what I got.

## Structure

* api-service : the Laravel based service, auth and read/write post api
* cache-service : node/express based readonly service
* client : a super minimal React client just to show things working

The mysql and redis containers are started as part of the docker compose
services, but they didn't need any customization so they don't have their
own distinct config.

### api-service

I haven't done PHP in quite a while, so I have to admit I had to lean on the
assistants quite a bit. But honestly with the tymon/jwt-auth package there
wasn't a ton that had to be handled. I used the default users table that the
system creates. The register call takes `name`, `email`, and `password`. But
the login method uses just `name` and `password` to authenticate the user.

I did include unit tests for the auth and posts endpoints. There isn't any
automated setup for the test environment. But there is an .env.testing config
in the root directory for the project and they're ready to run as long as
there's a database available.

In both github and in the container image I've included the .env I was using
when running locally, in the interest of making things just runable and to
have them work out of the box.

### cache-service

I made this just a read-through cache, just using the JWT provided by Laravel
to control access. I did have to pin the algorithm in the jwt.verify() call to
get the token working. I don't love that, and I would have assumed it wasn't 
necessary. jwt.io shows the algorithm as HS256 when I feed it a token, so I
thought the jsonwebtoken lib would have handled that. Something I would dig
into if I had time.

And the redis cache is just managed with a short TTL instead of doing
explicit validation. I know that's now awesome, but for a sample I didn't want
to spend too much time tinkering.

### client

This is completely unstyled and ugly. Hopefully you didn't want to evaluate
front-end chops at all. I just ran out of time and wanted to send along what
I have to try to time box this a bit and not burn too much time if it isn't
necessary. This does build a static version and serve it through nginx when
running from within a container. So it should be ready for a CDN or edge
deployment - I just didn't get to those parts.

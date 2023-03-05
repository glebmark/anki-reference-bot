#!/usr/bin/env -S node -r ts-node/register --no-warnings

// this workaround is required for simultaneous 
// operation of typeorm and migrations
// as they are separate connections to DB
import 'typeorm/cli';

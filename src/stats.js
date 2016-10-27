'use strict'

import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

import file_io from './file-io.js';


module.exports.command = 'stats [options...]';
module.exports.describe = 'Statistical analysis';


module.exports.builder = {
    'i': {
        'alias': 'input',
        'type': 'array',
        'describe': 'Specify input file(s)'
    },
    'o': {
        'alias': 'output',
        'type': 'string',
        'default': '/dev/stdout',
        'describe': 'Specify output file'
    },
    'd': {
        'alias': 'database',
        'type': 'string',
        'demand': true,
        'describe': 'Specify reference database'
    },
    'm': {
        'alias': 'method',
        'type': 'string',
        'choices': ['sum', 'mean', 'var', 'mannwhitneyu'],
        'demand': true,
        'describe': 'Specify analysis method'
    },
    'c': {
        'alias': 'config',
        'type': 'string',
        'describe': 'Specify configuration file'
    }
};


module.exports.handler = (args) => {

    let cmd = path.join(__dirname, '../tools/stats.py');
    let arg = '';

    // Input from "/dev/stdin"
    if (!args.input) {
        arg = args.config ?
            ['-d', args.database, '-m', args.method, '-c', args.config] :
            ['-d', args.database, '-m', args.method];
    // Input from file
    } else if (args.input.length === 1) {
        arg = args.config ?
            ['-d', args.database, '-m', args.method, '-i', args.input[0], '-c', args.config] :
            ['-d', args.database, '-m', args.method, '-i', args.input[0]];
    } else if (args.input.length === 2) {
        arg = args.config ?
            ['-d', args.database, '-m', args.method, '-i', args.input[0], args.input[1], '-c', args.config] :
            ['-d', args.database, '-m', args.method, '-i', args.input[0], args.input[1]]
    }

    let str = '';
    try {
        let result = child_process.spawnSync(cmd, arg, {
            'stdio': [0, 'pipe', 2]
        });
        str = result.stdout.toString();
    }

    catch(e) {
        process.stderr.write('Unexpected Error\n');
        process.exit(1);
    }


    file_io.write(args.output, str);
    process.exit(0);

};

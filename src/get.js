'use strict'

import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

import file_io from './file-io.js';


module.exports.command = 'get [options...]';
module.exports.describe = 'Get reference data from KEGG';


module.exports.builder = {
    'o': {
        'alias': 'output',
        'type': 'string',
        'default': '/dev/stdout',
        'describe': 'Specify output file'
    },
    'd': {
        'alias': 'database',
        'type': 'string',
        'choices': ['kegg'],
        'demand': true,
        'describe': 'Specify reference database'
    },
    'c': {
        'alias': 'config',
        'type': 'string',
        'describe': 'Specify configuration file'
    }
};


module.exports.handler = (args) => {

    let cmd = path.join(__dirname, '../tools/get.py');
    let arg = ['-d', args.database];

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

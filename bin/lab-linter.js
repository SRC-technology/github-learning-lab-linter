#!/usr/bin/env node
const yaml = require('js-yaml')
const fs = require('fs')
const { validateConfig } = require('..')
const { prettyPrint } = require('../prettyPrint')

try {
  const doc = yaml.safeLoad(fs.readFileSync(process.argv[2], 'utf8'))
  const verbose = process.argv[3] === '--verbose'
  if (verbose) console.log(doc)

  const errors = validateConfig(doc, verbose)
  
  if (errors.length > 0) {
    console.log(
      prettyPrint(errors, verbose)
        .join('\n\n')
    )
    process.exit(1)
  }
} catch (e) {
  console.log(e)
}
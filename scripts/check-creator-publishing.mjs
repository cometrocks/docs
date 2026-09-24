import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import SwaggerParser from '@apidevtools/swagger-parser'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const root = fileURLToPath(new URL('../', import.meta.url))
const load = async (path) => JSON.parse(await readFile(resolve(root, path), 'utf8'))
const spec = await load('public/openapi/creator-publishing.json')
const standalone = await load('public/openapi/creator-publishing-content-v2.schema.json')
const content = await load('public/openapi/creator-publishing-content-v2.example.json')
await SwaggerParser.validate(structuredClone(spec))

const ajv = new Ajv2020({ strict: false, allErrors: true })
addFormats(ajv)
ajv.addSchema({ ...spec, $id: 'https://docs.example.invalid/spec' })
const validators = new Map()
function validate(name, data, expected = true) {
  if (!validators.has(name)) {
    validators.set(name, ajv.compile({ $ref: `https://docs.example.invalid/spec#/components/schemas/${name}` }))
  }
  const validator = validators.get(name)
  assert.equal(validator(data), expected, `${name}: ${JSON.stringify(validator.errors)}`)
}

const restoreRefs = (value) => {
  if (Array.isArray(value)) return value.map(restoreRefs)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [
    key,
    key === '$ref' && typeof child === 'string'
      ? child.replace('#/components/schemas/ContentV2/', '#/')
      : restoreRefs(child),
  ]))
}
const embedded = structuredClone(spec.components.schemas.ContentV2)
delete embedded.description
assert.deepEqual(restoreRefs(embedded), standalone, 'Embedded and downloadable v2 schemas diverged')

const v1 = { schemaVersion: 1, sections: [{ id: 'header-one', type: 'header', showSection: true, layout: 'center', titleLocales: { en: 'My page' }, subtitleLocales: { en: 'Welcome' } }] }
validate('ContentV1', v1)
validate('ContentV2', content)
validate('CreatePage', { content })
validate('SavePage', { expectedDraftVersion: 1, content })
validate('ContentV1', { ...v1, extra: true }, false)
validate('ContentV1', { ...v1, sections: [{ ...v1.sections[0], layout: 'right' }] }, false)
validate('ContentV2', { ...content, extra: true }, false)

const expected = { expectedDraftVersion: 1, expectedPublicationVersion: 0, expectedActiveRevision: null }
const digest = 'a'.repeat(64)
validate('PublishPage', { ...expected, digest })
validate('PublishPage', { ...expected, digest: `sha256:${digest}` }, false)
validate('DeletePage', expected)
validate('DeletePage', { ...expected, digest }, false)
validate('DeletePage', { expectedDraftVersion: 1 }, false)
validate('DeletionReceipt', { schemaVersion: 1, pageId: 'page_example', deleted: true, publicationVersion: 1 })
validate('DeletionReceipt', { schemaVersion: 1, pageId: 'page_example', deleted: false, publicationVersion: 1 }, false)

// Structural checks do not claim that these short bytes are valid decoded media.
const upload = { schemaVersion: 1, fileName: 'example.png', mimeType: 'image/png', dataBase64: 'YWJj' }
validate('MediaUpload', upload)
for (const change of [{ fileName: '../example.png' }, { fileName: ' ' }, { fileName: 'x\n.png' }, { mimeType: 'image/svg+xml' }, { dataBase64: 'data:image/png;base64,YWJj' }, { dataBase64: 'Y WJj' }]) {
  validate('MediaUpload', { ...upload, ...change }, false)
}
const asset = { id: `upload_${digest}`, publicId: 'creator-publishing/example', url: 'https://media.example.com/example.png', thumbnailUrl: 'https://media.example.com/poster.jpg', fileName: 'example.png', mimeType: 'image/png', width: 400, height: 300, bytes: 2048, createdAt: '2026-09-24T00:00:00.000Z' }
validate('MediaUploaded', { schemaVersion: 1, asset })
validate('MediaList', { schemaVersion: 1, items: [asset], nextCursor: `1790208000000_upload_${digest}` })
validate('MediaList', { schemaVersion: 1, items: [], nextCursor: null })

const operations = Object.entries(spec.paths).flatMap(([path, methods]) => Object.entries(methods)
  .filter(([method]) => ['get', 'post', 'put', 'delete', 'patch'].includes(method))
  .map(([method, operation]) => ({ path, method, operation })))
assert.equal(operations.length, 14)
assert.equal(new Set(operations.map(({ operation }) => operation.operationId)).size, operations.length)
for (const { method, operation } of operations) {
  assert(operation.parameters.some((p) => p.$ref === '#/components/parameters/GrantGeneration'))
  if (['post', 'put', 'delete'].includes(method)) {
    assert(operation.parameters.some((p) => p.$ref === '#/components/parameters/IdempotencyKey'))
  }
  assert(operation.responses[method === 'post' ? '201' : '200'])
}
assert.deepEqual(spec.security, [{ CometAppKey: [] }])

// Optional exact-source check. Supply the inspected source snapshot; CI is offline
// and does not use credentials or imply deployed API availability.
const args = process.argv.slice(2)
if (args.length) {
  assert(args.length === 2 && args[0] === '--source-dir', 'Usage: --source-dir /absolute/snapshot')
  const source = resolve(args[1])
  const controller = await readFile(resolve(source, 'http.ts'), 'utf8')
  const base = '/v1/partners/{partnerId}/creators/{externalCreatorId}'
  const actual = [...controller.matchAll(/@(Get|Post|Put|Delete)\((?:'([^']*)')?\)/g)]
    .map((m) => `${m[1].toLowerCase()} ${base}${m[2] ? '/' + m[2].replace(/:([A-Za-z]+)/g, '{$1}') : ''}`).sort()
  assert.deepEqual(operations.map(({ method, path }) => `${method} ${path}`).sort(), actual)
  const generated = await import(pathToFileURL(resolve(source, 'generated-v2.ts')).href)
  assert.deepEqual(generated.publishingContentCapabilitiesV2.jsonSchema, standalone)
  assert.deepEqual(generated.parseContentV2(content), content)
  generated.validatePublicationV2(content)
  console.log('Source check passed: controller routes, generated v2 schema, parsing and publication readiness.')
}
console.log('Creator Publishing passed: OpenAPI 3.1, 14 operations, content/media/deletion fixtures and schema identity.')

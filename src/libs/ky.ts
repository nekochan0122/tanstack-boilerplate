import ky from 'ky'

const kyInstance = ky.create({
  retry: {
    limit: 3,
  },
})

export { kyInstance as ky }

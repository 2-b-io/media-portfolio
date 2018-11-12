import formatDate from 'dateformat'
import randomColor from 'randomcolor'

import ghost from '../services/ghost'

export default (app) => {
  app.use((req, res, next) => {
    res.locals.URL = `${ req.protocol }://${ req.get('host') }${ req.originalUrl }`

    next()
  })

  app.get('/', (req, res, next) => {
    res.render('home')
  })

  app.get('/posts/:page([0-9]+)?', async (req, res, next) => {
    const { page } = req.params

    if (1 === Number(page)) {
      return res.status(301).redirect('/posts')
    }

    const {
      posts,
      meta: { pagination }
    } = await ghost.listPosts(page)

    if (pagination.page > pagination.pages) {
      return res.redirect('/posts')
    }

    res.render('posts', {
      posts,
      pagination,
      formatDate
    })
  })

  app.get('/tags/:tag/:page([0-9]+)?', async (req, res, next) => {
    const { page, tag } = req.params

    if (1 === Number(page)) {
      return res.status(301).redirect(`/tags/${ tag }`)
    }

    const {
      posts,
      meta: { pagination }
    } = await ghost.listPosts(page, tag)

    if (pagination.page > pagination.pages) {
      return res.redirect(`/tags/${ tag }`)
    }

    res.render('posts', {
      posts,
      pagination,
      formatDate
    })
  })

  app.get('/:slug', async (req, res, next) => {
    const { slug } = req.params
    const { post } = await ghost.getPost(slug)

    res.render('post', {
      post,
      formatDate,
      color: randomColor()
    })
  })

  app.use((req, res, next) => {
    // TODO show 404 page
    res.redirect('/')
  })

  app.use((error, req, res, next) => {
    // TODO show 500 page
    res.redirect('/')
  })
}

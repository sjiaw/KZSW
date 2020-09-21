import request from '@/utils/request'

/**
 * 根据类型查询文章
 * */
export function queryList(query) {
  return request({
    url: '/admin/listByType',
    method: 'get',
    params: {
      type: query.type
    }
  })
}

/**
 * 根据ID查询文章
 * */
export function queryArticle(query) {
  return request({
    url: '/admin/getArticleById',
    method: 'get',
    params: {
      articleId: query.id
    }
  })
}

/**
 * 新建文章
 * */
export function createArticle(data) {
  return request({
    url: '/admin/uploadArticle',
    method: 'post',
    params: {
      auth: data.auth,
      type: data.type,
      title: data.title,
      content: data.content
    }
  })
}

/**
 * 编辑文章
 * */
export function putArticle(data) {
  return request({
    url: '/admin/updateArticle',
    method: 'post',
    params: {
      id: data.id,
      auth: data.auth,
      type: data.type,
      title: data.title,
      content: data.content
    }
  })
}

/**
 * 删除文章
 * */
export function delArticle(data) {
  return request({
    url: '/admin/deleteArticle',
    method: 'post',
    params: {
      articleId: data
    }
  })
}

/**
 * 获取阿里云上传通行证
 * */
export function getSTS(Query) {
  return request({
    url: '/ali/obtainSts',
    // url: '/ali/obtainPolicy',
    method: 'get',
    params: { token: Query.token, uid: Query.uid }
  })
}

'use strict';

import Koa from "koa"
import bodyParser from 'koa-bodyparser'
import session from "koa-session-redis"
import convert from 'koa-convert'
import csrf from 'koa-csrf'
import jwt from 'koa-jwt'
import etag from 'koa-etag'
import Router from 'koa-router'
import compress from 'koa-compress'
import request from 'request'

const app = new Koa();
const router = new Router();
var crypto = require('crypto')

//数据压缩传输 threshold压缩门槛 默认1mb
app.use(compress({
	threshold: '1mb'
}));

//for static file cache
//npm koa-conditional-get
app.use(async(ctx, next) => {
	await next();
	if (ctx.fresh) {
		ctx.status = 304;
		ctx.body = null;
	}
});
app.use(etag());

//在请求的header中，加字段Authorization：'Bearer '+token,jwt解密信息在ctx.state.key
// app.use(convert(jwt({
// 		secret: 'secret',
// 		key: 'member'
// 	})
// 	.unless({
// 		path: [/^\/test/]
// 	})));

app.keys = ['secret']; //cookies signed加密
app.use(bodyParser()); //提交内容转码
app.use(convert(session({
	store: {
		host: '127.0.0.1',
		port: 6379
	},
	key: "SESSIONID",
	signed: true,
	maxAge: 60 * 60 * 24 * 1000
})));

//跨站请求伪造 在session加了secret,token在ctx.csrf,在提交请求时加字段_csrf=token
app.use(convert(csrf()));

router.get('/111', async ctx => {
	// ctx.session.user = {
	// 	name: '12121'
	// };
	console.error(ctx.inspect(), ctx.toJSON());

	ctx.body = JSON.stringify({
		hello: 'world',
		Code:1111
	});
})

router.get('/api', async ctx => {
	console.log(111);
	ctx.body = JSON.stringify({
		hello: 'world'
	});
})

router.get('/test', async(ctx, next) => {
	ctx.body = await new Promise((resolve, reject) => {
		request.get('http://172.17.0.2:3000/', (error, response, body) => {
			resolve(body)
		})
	});
})

router.post('/', (ctx) => {
	console.error(ctx.request.body, ctx.session)
	ctx.body = ctx.request.body
});

app.use(router.routes());

app.listen(3001);
/// @flow
import serealize from 'serialize-javascript'
import _ from 'lodash'
type args = {
	app: string,
	css: string,
	asyncState: Object,
	initialState: Object,
	assets: Object,
	i18n: Object
}

const HTMLComponent = ({css, asyncState, initialState, assets, i18n, app}: args) => {
	const stringifiedAsyncState: string = serealize(asyncState)
	const stringifiedState: string = serealize(initialState)
	const stringifiedI18N: string = serealize(i18n)
	const wrapFuncs = {
		css: ({path}) => `<link rel="stylesheet" href="${path}" />`,
		js: ({path}) =>
			`<script src="${path}" type="text/javascript"></script>`
	}
	const assetsOrdered = ['manifest', 'polyfills', 'vendor', 'client']
	const getTags = assets => funcs => ext => {
		// sort assets to be injected in right order
		// const assetsOrdered = ['manifest', 'vendor', 'client']
		return Object.keys(assets)
			.filter(bundleName => assets[bundleName][ext])
			.sort((a, b) => assetsOrdered.indexOf(a) - assetsOrdered.indexOf(b))
			.map(bundleName => {
				const path = assets[bundleName][ext]
				return funcs[ext]({path})
			})
			.join('')
	}
	const getTagsFromAssets = getTags(_.pick(assets, assetsOrdered))(wrapFuncs)
	const cssTags = getTagsFromAssets('css')
	const jsTags = getTagsFromAssets('js')

	return `<html lang="${i18n.lang}">
			<head>
				<meta charset="utf-8" />
				<title>Suicrux</title>
				<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
				<meta
					name="description"
					content="Universal React starter based on Razzle. SSR/lazy-loading/i18n"
				/>
				<meta name="theme-color" content="#1b1e2f"/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<base href="/" />
				<meta name="msapplication-tap-highlight" content="no" />
				<link rel="manifest" href="manifest.json" />
				${css}
				${cssTags}
			<head>
			<body>
			<script>window.__ASYNC_STATE__ = ${stringifiedAsyncState}</script>
			<script>window.__INITIAL_STATE__ = ${stringifiedState}</script>
			<script>window.__I18N__ = ${stringifiedI18N}</script>
			<noscript>
				You are using outdated browser. You can install modern browser here:
				<a href="http://outdatedbrowser.com/">http://outdatedbrowser.com</a>.
			</noscript>
			<div id="app">${app}</div>
			${jsTags}
			</body>
			</html>`
}

export default HTMLComponent

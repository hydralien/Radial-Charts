module.exports = {
    publicPath: '',
    configureWebpack: {
        devtool: 'source-map',
        externals: ['pdfmake', 'xlsx', 'canvg']
    }
}
function Router() {
    this.routes = {};
    this.currentURL = '';
}
Router.prototype.route = function (path, callback) {
    this.routes[path] = callback || function () { console.log(path+'default function')};
}
Router.prototype.refresh = function () {
    this.currentURL = location.hash.slice(1) || '/index';
    this.routes[this.currentURL]();
}
Router.prototype.init = function () {
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
}
window.Router = new Router();
Router.route('/dollarlink', function () {
    alert('only bind english')
})
Router.route('/index')
window.Router.init();
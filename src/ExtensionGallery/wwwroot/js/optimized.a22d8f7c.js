var galleryApp=angular.module("galleryApp",["ngRoute"]).filter("escape",function(){return window.encodeURIComponent}).config(["$routeProvider","$locationProvider",function(a){a.when("/",{controller:"homeController",templateUrl:"app/views/home.html"}).when("/author/:name",{controller:"authorController",templateUrl:"app/views/home.html"}).when("/extension/:id/",{controller:"extensionController",templateUrl:"app/views/extension.html"}).when("/upload",{controller:"uploadController",templateUrl:"app/views/upload.html"}).otherwise({redirectTo:"/"})}]),constants={DEFAULT_ICON_IMAGE:"/img/default-icon.png",DEFAULT_PREVIEW_IMAGE:"/img/default-preview.png"};galleryApp.service("dataService",["$http",function(a){var b="/extension/";this.normalizePackage=function(a){return a.DownloadUrl="/extensions/"+a.ID+"/extension.vsix",a.Icon=a.Icon?"/extensions/"+a.ID+"/preview.png":constants.DEFAULT_ICON_IMAGE,a.Preview=a.Preview?"/extensions/"+a.ID+"/preview.png":constants.DEFAULT_PREVIEW_IMAGE,a.SupportedVersions=a.SupportedVersions.map(function(a){return 0==a.indexOf("11.")?2012:0==a.indexOf("12.")?2013:0==a.indexOf("14.")?2015:void 0}),a},this.getAllExtensions=function(){return a.get(b)},this.getExtension=function(c){return a.get(b+"get/"+c)},this.upload=function(c,d){return a.post(b+"uploadfile"+d,new Blob([c],{}))}}]),galleryApp.controller("homeController",["$scope","dataService",function(a,b){a.headline="Nightly builds of popular extensions",a.feed="/feed/",a.query="",a.packageSearch=function(b){var c=a.query.toUpperCase();return-1!=b.Name.toUpperCase().indexOf(c)||-1!=b.Description.toUpperCase().indexOf(c)||-1!=b.Author.toUpperCase().indexOf(c)||b.Tags&&-1!=b.Tags.toUpperCase().indexOf(c)},b.getAllExtensions().success(function(c){for(var d=0;d<c.length;d++)b.normalizePackage(c[d]);a.packages=c})}]),galleryApp.controller("extensionController",["$scope","$location","$route","dataService",function(a,b,c,d){var e=c.current.params.id;a.older=[],d.getExtension(e).success(function(c){c.Error&&b.path("/");d.normalizePackage(c);a["package"]=c})}]),galleryApp.controller("uploadController",["$scope","$location","dataService",function(a,b,c){a.error="",a.repo="",a.issuetracker="",localStorage&&(a.repo=localStorage["upload.repo"],a.issuetracker=localStorage["upload.issuetracker"]),a.upload=function(){var d=document.getElementById("uploadfile"),e=new FileReader;e.onload=function(d){c.upload(d.target.result,"?repo="+encodeURIComponent(a.repo)+"&issuetracker="+encodeURIComponent(a.issuetracker)).success(function(a){b.path("/extension/"+a.ID)}).error(function(b){a.error=b})},e.readAsArrayBuffer(d.files[0]),localStorage&&localStorage["upload.repo"]&&(localStorage["upload.repo"]=a.repo),localStorage&&localStorage["upload.issuetracker"]&&(localStorage["upload.issuetracker"]=a.issuetracker)}}]),angular.module("galleryApp").run(["$templateCache",function(a){"use strict";a.put("app/views/extension.html",'<div id=extensions><div data-ng-model=package data-ng-show=package><h1 class=page-header>{{package.Name}}</h1><article><img class=preview data-ng-src={{package.Preview}} alt="{{package.Name}}"><div class=properties><p>{{package.Description}}</p><div class=details><p><strong>Author:</strong> <a data-ng-href="#/author/{{package.Author | lowercase | escape }}">{{package.Author}}</a></p><p><strong>Supports:</strong> Visual Studio <span data-ng-repeat="version in package.SupportedVersions">{{version + \'&nbsp;\'}}</span></p><p data-ng-show=package.Tags><strong>Tags:</strong> {{package.Tags}}</p><p><strong>Version:</strong> {{package.Version}}</p><p><strong>Updated:</strong> <time datetime="{{package.DatePublished | date:\'yyyy-MM-dd\'}}">{{package.DatePublished | date:\'MMM d. yyyy\'}}</time></p><ul><li data-ng-show=package.MoreInfoUrl><a href={{package.MoreInfoUrl}}><span class="glyphicon glyphicon-home" aria-hidden=true></span> Website</a></li><li data-ng-show=package.Repo><a href={{package.Repo}}><span class="glyphicon glyphicon-pencil" aria-hidden=true></span> Source code</a></li><li data-ng-show=package.IssueTracker><a href={{package.IssueTracker}}><span class="glyphicon glyphicon-ok" aria-hidden=true></span> Issue Tracker</a></li></ul></div><br><a class="btn-sm btn-success" data-ng-href={{package.DownloadUrl}}><span class="glyphicon glyphicon-cloud-download" aria-hidden=true></span> Download</a> <a class="btn-sm btn-default" data-ng-href=/feed/extension/{{package.ID}}><span class="glyphicon glyphicon-cog" aria-hidden=true></span> Feed</a></div></article><br><div data-ng-show=package.License><h2>License</h2><pre>{{package.License}}</pre></div></div></div>'),a.put("app/views/home.html",'<h1 class=page-header>{{headline}} <a data-ng-href={{feed}} class="btn btn-default"><span class="glyphicon glyphicon-cog" aria-hidden=true></span> Feed</a></h1><div id=extensions><div id=searchform class=form-group><label class=sr-only for=search>Search</label><div class=input-group><div class=input-group-addon><span class="glyphicon glyphicon-search"></span></div><input type=text id=search data-ng-model=query placeholder=Search class="form-control"></div></div><article data-ng-repeat="package in packages | filter: packageSearch"><img class=icon data-ng-src={{package.Icon}} alt="{{package.Name}}"><div><h3><a data-ng-href=#/extension/{{package.ID}}>{{package.Name}}</a></h3><a data-ng-href="#/author/{{package.Author | lowercase | escape }}">{{package.Author}}</a><p>{{package.Description}}</p><a class="btn-sm btn-success" data-ng-href={{package.DownloadUrl}}><span class="glyphicon glyphicon-cloud-download" aria-hidden=true></span> Download</a> <a data-ng-href=/feed/extension/{{package.ID}} class="btn-sm btn-default"><span class="glyphicon glyphicon-cog" aria-hidden=true></span> Feed</a> <time datetime="{{package.DatePublished | date:\'yyyy-MM-dd\'}}">{{package.DatePublished | date:\'&nbsp;MMM d. yyyy\'}}</time></div></article></div>'),a.put("app/views/upload.html",'<h1 class=page-header>Upload new extension</h1><p>Tincidunt integer eu augue augue nunc elit dolor, luctus placerat scelerisque euismod, iaculis eu lacus nunc mi elit, vehicula ut laoreet ac, aliquam sit amet justo nunc tempor, metus vel.</p><form id=upload ng-hide=form.$submitted ng-submit=upload()><div class=form-group><label for=repo>Source code</label><input type=url ng-model=repo id=repo class=form-control placeholder="Url to the source code repository"></div><div class=form-group><label for=issuetracker>Issue tracker</label><input type=url id=issuetracker ng-model=issuetracker class=form-control placeholder="Url to the issue tracker"></div><div class=form-group><label for=uploadfile>Select file</label><input type=file id=uploadfile accept=.vsix required><p class=help-block>Only .vsix files are supported</p></div><input type=submit value=Upload class="btn-sm btn-primary"><p class=has-error ng-show="upload.url.$invalid || error">{{error}}</p></form>')}]),galleryApp.controller("authorController",["$scope","$route","dataService",function(a,b,c){function d(a){return a.replace(/\w\S*/g,function(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()})}a.headline="Extensions by "+d(b.current.params.name),a.feed="/feed/author/"+b.current.params.name+"/",a.query="",a.packageSearch=function(b){var c=a.query.toUpperCase();return-1!=b.Name.toUpperCase().indexOf(c)||-1!=b.Description.toUpperCase().indexOf(c)||-1!=b.Author.toUpperCase().indexOf(c)||b.Tags&&-1!=b.Tags.toUpperCase().indexOf(c)},c.getAllExtensions().success(function(d){packages=[];for(var e=0;e<d.length;e++){var f=d[e];f.Author.toUpperCase()===b.current.params.name.toUpperCase()&&packages.push(c.normalizePackage(f))}a.packages=packages})}]);
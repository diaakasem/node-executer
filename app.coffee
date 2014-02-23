
_ = require 'lodash'
yahoo = require('./node/yahoo')
Yahoo = new yahoo.Yahoo()
twitter = require('./node/twitter')
Twitter = new twitter.Twitter()
path = require('path')
fs = require('fs')
lodash = require('lodash')
db = require './node/db'
{Manager} = require './node/youwiki'
mongoose = require('mongoose')

deleteFolderRecursive = (path) ->
  files = []
  if fs.existsSync(path)
    files = fs.readdirSync(path)
    files.forEach (file, index) ->
      curPath = path + "/" + file
      if fs.statSync(curPath).isDirectory() # recurse
        deleteFolderRecursive curPath
      else # delete file
        fs.unlinkSync curPath
      return

    fs.rmdirSync path
  return


projectsPath = path.join(__dirname, 'app', 'projects')

express = require("express")
app = express()
app.set('view engine', 'ejs')
app.use '/', express.static(__dirname + '/app')
app.use(express.bodyParser())
app.engine('html', require('ejs').renderFile)
app.set('db connect string', 'mongodb://localhost/dwikia')
db.config(app)
ProjectModel = mongoose.model('Project')

app.get '/wikipedia/build/:name', (req, res)->
  res.json({ hello: 'world' })


m = new Manager()

end = (req, res)->
  (meta)->
    return res.json({result: "error"})  if meta is 'error'
    meta.status = 'created'
    project = new ProjectModel()
    project = _.extend project, meta
    project.save (err, obj)->
      return res.json {"error": err}  if err
      console.log "Returning result..."
      res.json {result: "done"}

app.post '/build/url/', (req, res)->
  url = req.body.url
  m.run(url, end(req, res))

app.post '/build/random/', (req, res)->
  m.run('random', end(req, res))

app.post '/build/today/', (req, res)->
  m.run(null, end(req, res))

app.post '/project/', (req, res)->
  #name = req.body.name
  status = req.body.status
  #projects = fs.readdirSync(projectsPath)
  ProjectModel.find {status: status}, (err, list)->
    res.json list

app.delete '/project/id/:id', (req, res)->
  id = req.params.id
  ProjectModel.remove {_id: id}, (err, project)->
    res.json project

app.delete '/project/:name', (req, res)->
  name = req.params.name
  ProjectModel.remove {name: name}, (err, project)->
    deleteFolderRecursive path.join('app', 'projects', name)
    res.json project

app.post '/project/:name', (req, res)->
  name = req.params.name
  status = req.body.status
  ProjectModel.update {name: name}, {status: status}, (err, project)->
    res.json project

app.get '/project/:name', (req, res)->
  name = req.params.name
  ProjectModel.findOne {name: name}, (err, project)->
    res.json project

app.get '/trends/:name', (req, res)->
  name = req.params.name
  Yahoo.woeid  name, (err, obj)->
    body = JSON.parse(obj.body)
    if not body.places.place or not body.places.place.length
      console.log obj
      return res.send null
    woeid = body.places.place[0].woeid
    console.log woeid
    Twitter.trendsFor woeid, (err, obj)->
      console.log obj
      res.send obj


app.listen 3000

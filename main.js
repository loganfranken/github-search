var request = require('request');

var options = {
  url: 'https://api.github.com/search/repositories?q=ucsb',
  headers: {
    'User-Agent': 'github-search'
  }
};

// Search Repositories
var repos = [];
var pageCount = 1;

function searchRepositories()
{
  options.url += ('&page=' + pageCount);

  request(options, function (error, response, body) {

    var results = JSON.parse(body);

    if(!results.items || results.items.length === 0) {
      outputResults();
      return;
    }

    results.items.forEach(function(result) {
      repos.push(result);
    });

    pageCount++;
    searchRepositories();

  });
}

function outputResults()
{
  var orgs = {};
  var projects = [];

  repos.forEach(function(repo) {

    // Store Organizations
    if(repo.owner.type === 'Organization')
    {
      orgs[repo.owner.login] = { url: repo.owner.html_url };
    }

    // Store Projects
    else
    {
      projects.push({ url: repo.html_url });
    }

  });

  // Display Organizations
  var orgCount = 0;

  for(var org in orgs)
  {
    orgCount++;
  }

  console.log('Total Organizations: ' + orgCount);

  for(var orgName in orgs)
  {
    console.log(orgs[orgName].url);
  }

  // Display Projects'
  console.log('\n');
  console.log('Total Projects: ' + projects.length);

  projects.forEach(function(project) {
    console.log(project.url);
  });
}

searchRepositories();

export class GithubHandler {
	constructor(url) {
		this.commits = [];
		this.url = url;

		// TODO actually do a bit of parsing on the url to handle http://...
		// currently only handles "username/reponame"
	}

	compare(a,b) {
		if (a[1] < b[1]) return -1;
		if (a[1] > b[1]) return 1;
		return 0;
	}

	get_commits(sha, search) {
		var query = search + "?per_page=100&sha=" + sha;
		console.log(query);

		var client = new XMLHttpRequest();

		var parent = this;

		client.open('GET', query, false);
		client.onreadystatechange = function() {
			if (this.readyState === 4) {
				var templist = JSON.parse(client.responseText);
				// append commits to global list commit_list
				for (var i = 0; i < templist.length; i++){
					parent.commits.push([templist[i].commit.message, templist[i].commit.author.date]);
				}
			}
		}
		client.send();
	}

	get_commit_list(list, commit_url) {
		var branch_heads = [];
		var branch_commits;

		for (var i = 0; i < list.length; i++) {
			branch_commits = commit_url + "/" + list[i].name;
			console.log(branch_commits);

			var client = new XMLHttpRequest();
			client.open('GET', branch_commits, false);
			client.onreadystatechange = function() {
				if (this.readyState === 4) {
					var templist = JSON.parse(client.responseText);

					branch_heads.push(templist.sha);
				}
			}
			client.send();
		}

		console.log(branch_heads);

		//get commits in each branch
		for (i = 0; i < branch_heads.length; i++ ) {
			this.get_commits(branch_heads[i], commit_url);

		}
		this.commits.sort(this.compare);

		var k = this.commits.length;
		for (i = 0; i < k; i++ ) {
			var j = i+1;

			if (j >= k){
				break;
			}

			while (this.commits[i][1] === this.commits[j][1]){
				if (this.commits[i][0] === this.commits[j][0]){
					this.commits.splice(j,1);
					k--;
				}
				else {
					j++;
				}
			}
		}

		for (i = 0; i < this.commits.length; i++ ) {
			// This is where the commits are
			console.log(this.commits[i]);
		}
	}

	parse_repo() {
		var search_url = "http://api.github.com/repos/" + this.url;
		var branch_url = search_url + "/branches";
		var commit_url = search_url + "/commits";
		var branchlist;
		var client = new XMLHttpRequest();

		client.open('GET', branch_url);
		var parent = this;
		client.onreadystatechange = function() {
			if (this.readyState === 4) {
				branchlist = JSON.parse(client.responseText);
				parent.get_commit_list(branchlist, commit_url);
			}
		}
		client.send();
	}
}

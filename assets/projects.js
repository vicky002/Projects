$(function() {
    var repoExclude = [
        'Reddit-Tools',
        'Evernote-Tools',
        'Fitbit-Tools',
        'Foursquare-Tools',
        'GitHub-Tools',
        'Instagram-Tools',
        'Todoist-Tools',
        'Tumblr-Tools',
        'Last.fm-Tools',
        'Facebook-Tools',
        'LearningRos',
        '100Leaders',
        'LearningFortran',
        'slog',
        'flat-file-capture',
        'dotfiles'
    ];

    // Put custom repo URL's in this object, keyed by repo name.
    var repoUrls = {
        'Instachart': 'http://instachart.herokuapp.com',
        'Showlist': 'http://facebookhack.herokuapp.com',
        'LifeAndTimes-Simple': 'http://lifeandtimes.herokuapp.com'
    };

    function repoUrl(repo) {
        return repoUrls[repo.name] || repo.html_url;
    }

    // Put custom repo descriptions in this object, keyed by repo name.
    var repoDescriptions = { };

    function repoDescription(repo) {
        return repoDescriptions[repo.name] || repo.description;
    }

    function addRecentlyUpdatedRepo(e) {
        var t = $("<li>");
        var n = $("<a>").attr("href", e.html_url).text(e.name);
        t.append($("<span>").addClass("name").append(n));
        var r = $("<a>").attr("href", e.html_url + "/commits").text(strftime("%h %e, %Y", e.pushed_at));
        t.append($("<span>").addClass("time").append(r));
        t.append('<span class="bullet">&sdot;</span>');
        var i = $("<a>").attr("href", e.html_url + "/watchers").text(e.watchers + " stargazers");
        t.append($("<span>").addClass("watchers").append(i));
        t.append('<span class="bullet">&sdot;</span>');
        var s = $("<a>").attr("href", e.html_url + "/network").text(e.forks + " forks");
        t.append($("<span>").addClass("forks").append(s));
        t.appendTo("#recently-updated-repos");
    }

    function addRepo(e) {
        if (repoExclude.indexOf(e.name) == -1) {
            var t = $("<li>").addClass("repo grid-1 " + (e.language || "").toLowerCase());
            var n = $("<a>").attr("href", repoUrl(e)).appendTo(t);
            n.append($("<h2>").text(e.name));
            n.append($("<h3>").text(e.language));
            n.append($("<p>").text(repoDescription(e)));
            t.appendTo("#repos");
        }
    }

    function addRepos(e, t) {
        e = e || [];
        t = t || 1;
        var n = "https://api.github.com/users/vicky002/repos?callback=?" + "&per_page=100" + "&page=" + t;
        $.getJSON(n, function(n) {
            if (n.data && n.data.length > 0) {
                e = e.concat(n.data);
                addRepos(e, t + 1);
            } else {
                $(function() {
                    $("#num-repos").text(e.length);
                    $.each(e, function(e, t) {
                        t.pushed_at = new Date(t.pushed_at);
                        var n = 1.146 * Math.pow(10, -9);
                        var r = new Date - Date.parse(t.pushed_at);
                        var i = new Date - Date.parse(t.created_at);
                        var s = 1;
                        var o = 1.314 * Math.pow(10, 7);
                        t.hotness = s * Math.pow(Math.E, -1 * n * r);
                        t.hotness += o * t.watchers / i;
                    });
                    e.sort(function(e, t) {
                        if (e.hotness < t.hotness) return 1;
                        if (t.hotness < e.hotness) return -1;
                        return 0;
                    });
                    $.each(e, function(e, t) {
                        addRepo(t);
                    });
                    e.sort(function(e, t) {
                        if (e.pushed_at < t.pushed_at) return 1;
                        if (t.pushed_at < e.pushed_at) return -1;
                        return 0;
                    });
                    $.each(e.slice(0, 3), function(e, t) {
                        addRecentlyUpdatedRepo(t);
                    })
                })
            }
        })
    }

    addRepos();

});/**
 * Created by vikesh on 6/11/15.
 */

jQuery(function($) {
    var TERMS = {};
    var LATEST_POLL = null;
    var ROW_TEMPLATE = null;
        
    var focusInput = function() { $('#term').focus(); }
    focusInput();
    
    var setPermalinkTerms = function(terms) {
        var link = $('#permalink');
        if (terms.length) {
            link.attr('href', '/rate/' + $.map(terms, encodePlus).join('/'));
        }
        else {
            link.attr('href', '/rate');
        }
    }
    
    var addPermalinkTerm = function(term) {
        var link = $('#permalink');
        link.attr('href', link.attr('href') + '/' + encodePlus(term));
    }
    
    var encodePlus = function(s) { return encodeURIComponent(s).replace(/(%20)+/g, '+'); }
    var decodePlus = function(s) { return decodeURIComponent(s.replace(/[+]/g, '%20')); }
    
    var handleResponse = function(result, status) {
        var data = TERMS[result.term];
        if (data) {
            $.extend(data, result);
            updateRow(data);
        }
    }
    
    var updateRow = function(data) {
        data.ratio = data.rocks / (data.sucks + data.rocks);
        data.row.removeClass('loading');
        var graph = data.row.find('td.result-graph');
        if (!isNaN(data.ratio)) {
            data.score = (data.ratio * 10).toFixed(1);
            graph.find('.bar').width(data.ratio * 100 + '%');
            graph.find('.graph').click(function(e) {
                $(this).parents('table.graph').removeClass('graph').addClass('details');
                focusInput();
            }).attr('title', "\u201C" + data.term + "\u201D score");
        }
        else {
            data.score = '?'
        }
        data.row.find('td.result-score').text(data.score);
        var details = graph.find('.details');
        details.click(function(e) {
            $(this).parents('table.details').removeClass('details').addClass('graph');
            focusInput();
        }).attr('title', "\u201C" + data.term + "\u201D results");
        details.find('.sucks').text(data.sucks).end().find('.rocks').text(data.rocks);
    }
    
    var handleSearch = function(e) {
        var form = $(this);
        var input = $('#term');
        var term = $.trim(input.val());
        if (term) {
            addTerm(term);
        }
        input.val("");
        return false;
    }
    
    var addTerm = function(term) {
        $('#results').show('fast');
        if (!TERMS[term]) {
            $('#sort').removeClass('asc').removeClass('desc');
            addPermalinkTerm(term);
            var row = $(ROW_TEMPLATE).appendTo('#result-rows');
            row.data('term', term);
            row.find('td.result-term').text(term);
            if (row.siblings('tr').length % 2) {
                row.addClass('odd');
            }
            TERMS[term] = {
                term: term,
                row: row,
                bar: row.find('div.bar:first')
            };
            var request = $.ajax({
                cache: false,
                data: {term: term},
                dataType: 'json',
                success: handleResponse,
                url: '/query'
            });
        }
    }
    
    var sortResults = function(e) {
        var link = $(this);
        var rows = $('#result-rows tr').get();
        rows.sort(function(a, b) {
            var aData = TERMS[$(a).data('term')];
            var bData = TERMS[$(b).data('term')];
            return bData.ratio - aData.ratio;
        });
        if (link.hasClass('asc')) {
            link.removeClass('asc').addClass('desc');
        }
        else {
            link.removeClass('desc').addClass('asc');
            rows.reverse();
        }
        $('#result-rows').remove('tr').append(rows);
        var terms = $.map(rows, function(row, i) {
            var row = $(row);
            if (i % 2) {
                row.addClass('odd');
            }
            else {
                row.removeClass('odd');
            }
            return row.data('term');
        })
        setPermalinkTerms(terms);
        focusInput();
        return false;
    }
    
    var clearResults = function(e) {
        if (document.location.pathname != '/') {
            return true;
        }
        $('#results').hide(250, function() {
            $('#result-rows').empty();
            setPermalinkTerms([]);
        });
        TERMS = {};
        focusInput();
        return false;
    }
    
    var updateLatest = function() {
        var request = $.getJSON('/latest', function(latest) {
            var results = $('#latest-results tbody').empty();
            $('#latest-results tfoot').hide();
            $.each(latest, function(i) {
                var term = this.term;
                var row = $(ROW_TEMPLATE).appendTo(results);
                row.data('term', term);
                row.find('td.result-term').text(term);
                if (i % 2) {
                    row.addClass('odd');
                }
                var data = $.extend({row: row}, this);
                updateRow(data);
            });
        });
        LATEST_POLL = setTimeout(updateLatest, 5000);
    }
    
    var changeTab = function(e) {
        var link = $(this);
        if (!link.hasClass('selected')) {
            $('#sections a.tab.selected').removeClass('selected');
            $('#sections .section:visible').slideUp(100);
            var name = link.attr('id').split('-')[0];
            link.addClass('selected');
            $('#' + name).slideDown(100);
            clearTimeout(LATEST_POLL);
            if (name == 'latest') {
                updateLatest();
            }
        }
        focusInput();
        return false;
    }
    
    $.ajax({url: '/row.html', async: false, cache: true, dataType: 'html',
        success: function(data, status) { ROW_TEMPLATE = data; }
    });
    
    $('#search-form').submit(handleSearch);
    $('#sort').click(sortResults);
    $('#clear').click(clearResults);
    $('#sections a.tab').click(changeTab);
    
    // Parse the search terms out of the URL    
    var pathMatches = document.URL.match(/^https?:\/\/[^\/]*\/(rate)\/([^?]+)\/?/);
    if (pathMatches.length >= 3 && pathMatches[1] == 'rate') {
        var terms = $.map(pathMatches[2].split('/'), decodePlus);
        $.map(terms, addTerm);
    }
});

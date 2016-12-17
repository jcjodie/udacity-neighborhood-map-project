var places = [ 
  {"title" : "apple"},
  {"title" : "lemon"},
  {"title" : "orange"}
];

var viewModel = function() {
  var self = this;

  self.points = ko.observableArray(places);

  self.query = ko.observable('');

  self.search = ko.computed(function(){
    return ko.utils.arrayFilter(self.points(), function(point){
      return point.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
    });
  });
};

ko.applyBindings(new viewModel());
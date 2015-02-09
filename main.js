$(function() {
  app.init();

});
var self;
var db;
var app ={
  init:function(){
    self = this;
    // If the database does not exist create it
    db = openDatabase('code_snip', '1.0', 'my first database', 2 * 1024 * 1024);
    db.transaction(function (tx) {
      tx.executeSql("CREATE TABLE IF NOT EXISTS " +
                  "codeSnips(ID INTEGER PRIMARY KEY ASC, label TEXT, code_snip BLOB,category TEXT)", [],self.onSuccess,self.onError);
    });

    db.transaction(function (tx) {
      tx.executeSql("CREATE TABLE IF NOT EXISTS " +
                  "category(ID INTEGER PRIMARY KEY ASC, label TEXT)", [],self.onSuccess,self.onError);
    });

    this.setButtonListners();
  },
  addCategory:function(category){
    var category = category;
    db.transaction(function (tx) {
      tx.executeSql("INSERT INTO category (label) VALUES (?);",
          [category],
          self.onSuccess,
          self.onError
      );
    });
  },
  setButtonListners:function(){

    $('#save').click(function(){
      var label = $('#snip_label').val();
      var snip = $('#code_snip').val();
      var category = $( "#category option:selected" ).val();
      self.saveSnipit(label,snip,category);
    });

    $('#addEntry').click(function(){
      $('#category').css('display','none');
      $('#newCategory').css('display','block');
      var category = $( "#category option:selected" ).text();
      //self.addCategory()
    });

    $('#view').click(function(){
      self.viewList()
    });
  },
  viewList:function(){
    $('#addView').css('display','none');
    $('#viewData').css('display','block');
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM codeSnips;',[],function(tx, results){
         var len = results.rows.length, i;
          for (i = 0; i < len; i++) {
            var obj = results.rows.item(i);
            $('#list').append("<li>"+obj['label']+"</li>");

          }
          //$('#list').append("")
      });
    });

  },

  saveSnipit:function(label,snip,category){
    var label = label;
    var snip = snip;
    var category= category;
    db.transaction(function (tx) {
      tx.executeSql("INSERT INTO codeSnips (label, code_snip,category) VALUES (?,?,?);",
          [label,snip,category],
          self.onSuccess,
          self.onError
      );
    });
  },
  onSuccess:function(){
    console.log('Success');
  },
  onError:function(e){
    console.log('Error' + e);

  },
  removeDataBase:function(){
    db.transaction(function (tx) {
      tx.executeSql('DROP TABLE category;');
      tx.executeSql('DROP TABLE codeSnips;');
    });
  }
}

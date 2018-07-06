angular.module('factories', [])

.factory("factories",[function () {
	return{
		findSelect:function(id, array_select, option) {
		    if(option){
		      var result=array_select.find( myObject => myObject.option === id );
		    }else{
		      var result=array_select.find( myObject => myObject.id === id );
		    }
		    return result;
		},

		index_of:function (id, myObject) {
			var i=0, idx=-1;
			for(i=0; i<myObject.length; i++){
				if(myObject[i].id==id){
					idx=i;
					break;
				}
			}
			return idx;
			
		}
	}
}])
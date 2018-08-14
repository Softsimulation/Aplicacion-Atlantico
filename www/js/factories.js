angular.module('factories', [])

.factory("factories",[function () {
	return{
		findSelect:function(id, array_select, option) {
		    let result;
		    if(option){
		       result=array_select.find( myObject => myObject.option === id );
		    }else{
		       result=array_select.find( myObject => myObject.id === id );
		    }
		    return result;
		},

		index_of:function (id, myObject) {
			let i=0, idx=-1;
			for(i=0; i<myObject.length; i++){
				if(myObject[i].id==id){
					idx=i;
					break;
				}
			}
			return idx;
		},

		findSelectMultiple: function (array_id, array_object) {
			let i=0;
			let result=[];
			for(i=0; i<array_id.length; i++){
				if(array_object.find( myObject => myObject.id === array_id[i])){
					result.push(array_object.find( myObject => myObject.id === array_id[i]));
				}
			}
			return result;

		},

		findSelectMultipleId: function (id, array_object) {
			let result=[];
			let i=0;
			for(i=0;i<array_object.length;i++){
				if(array_object[i].pais_id==id){
					result.push(array_object[i]);
				}
			}
			return result;
		},

		findSelectMultipleDpts: function (id, array_object) {
			let result=[];
			let i=0;
			for(i=0;i<array_object.length;i++){
				if(array_object[i].departamento_id==id){
					result.push(array_object[i]);
				}
			}

			return result;
		}
	}
}])
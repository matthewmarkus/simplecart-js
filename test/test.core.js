
module('simpleCart core functions');
test("adding and removing items", function(){
	
	simpleCart.empty();
	
	same( simpleCart.quantity() , 0 , "Quantity correct after one item added" );
	
	var item = simpleCart.add({
		name: "Cool T-shirt",
		price: 25,
	});
	
	same( simpleCart.quantity() , 1 , "Quantity correct after one item added" );
	same( simpleCart.total() , 25 , "Total correct after one item added" );
	same( item.get( 'price' ) , 25 , "Price is correctly saved" );
	same( item.get( 'name' ) , "Cool T-shirt", "Name is correctly saved" );
});

test("editing items", function(){	
	
	simpleCart.empty();
	
	var item = simpleCart.add({
		name: "Cool T-shirt",
		price: 25,
	});
	
	item.set( "name" , "Really Cool Shorts" );
	item.set("quantity" , 2 );
	
	same( item.get( "name" ) , "Really Cool Shorts" , "Name attribute updated with .set" );
	same( item.get( "quantity" ) , 2 , "quantity updated with .set" );
	
	item.quantity(2);
	
	same( item.quantity() , 2 , "Setting quantity with item.quantity() works" );
	
	item.increment();
	
	same( simpleCart.quantity() , 3 , "Quantity is two after item incremented");
	same( item.quantity() , 3 , "Item quantity incremented to 2" );
	same( simpleCart.total() , 75 , "Total increased properly after incremented item");
	
	item.increment( 5 );
	
	same( item.quantity() , 8 , "Quantity incremented with larger value");
	
	item.remove();
	
	same( simpleCart.quantity() , 0 , "Quantity correct after item removed" );
	same( simpleCart.total() , 0 , "Total correct after item removed" );
	
});


module('DOM functions');
test("editing items", function(){	

	


});

	module('simpleCart core functions');
	test("simpleCart.chunk() function works", function(){
		
		var str = "11111" + "11111" + "11111" + "11111" + "11111",
			array = [ "11111" , "11111" , "11111" , "11111" , "11111" ];
			test = simpleCart.chunk( str , 5 );
			
		same( test , array , "chunked array properly into 5 piece chunks");
		
	});
	
	test("simpleCart.toCurrency() function works", function(){
		
		var number = 2234.23;
		
		same( simpleCart.toCurrency( number ), "$2,234.23" , "Currency Base Case");
		
		same( simpleCart.toCurrency( number , { delimiter: " " }) ,"$2 234.23" ,  "Changing Delimiter");

		same( simpleCart.toCurrency( number , { decimal: ","  }) ,  "$2,234,23" , "Changing decimal delimiter");

		same(  simpleCart.toCurrency( number , { symbol: "!"  }) , "!2,234.23" , "Changing currency symbol");
		
		same( simpleCart.toCurrency( number , { accuracy: 1  }) , "$2,234.2" ,  "Changing decimal accuracy");
		
		same( simpleCart.toCurrency( number , { after: true  }) ,  "2,234.23$" , "Changing symbol location");
		
		same( simpleCart.toCurrency( number , { symbol: "", accuracy:0, delimiter:"" }) , "2234", "Long hand toInt string" );
		
		
	});
	
	
	test("simpleCart.each() function works", function(){
		
		var myarray = ['bob' , 'joe' , function bill(){} , 'jeff' ];
		
		function test_bill(){
			var test = true;
			simpleCart.each( myarray , function(item,x){
				if( x === 3 ){
					test = false;
				}
			});
			return test;
		}
		
		function test_names(){
			var ms = "";
			simpleCart.each( myarray , function(item,x){
				ms += item;
			});
			return ms;
		}
		
		ok( test_bill() , "function dismissed in each" );
		same( test_names() , "bobjoejeff" , "items iterated properly");
		
		
		
		function test_cart_items(){
			var items = simpleCart.items,
				pass = true;
				
			simpleCart.each(function(item,x){
				if( items[item.id] !== item ){
					pass = fail;
				}
			});
			
			return pass;
		}
	
		ok( test_cart_items() , "simpleCart items iterated correctly with .each");
	
	});
	
	asyncTest("simpleCart.ready() works", function(){
		simpleCart.ready(function(){
			ok(true);
			start();
		});
	});
	
	

	module('simpleCart copy function');
	test("simpleCart.copy() function works", function(){
			
		var sc_demo = simpleCart.copy('sc_demo');
		sc_demo.add({ name:"bob",price:34,size:"big"});
		
	});
	
	
	
	
	module('tax and shipping');
	test("simpleCart.copy() function works", function(){
			
		simpleCart.empty();
		simpleCart({
			taxRate: 0.06 ,
			shippingFlatRate: 20
		});
		
		simpleCart.add({name: "bob" , price: 2 });
		
		same( simpleCart.taxRate() , 0.06 , "Tax Rate saved properly");
		same( simpleCart.tax() , 0.06*2 , "Tax Cost Calculated properly");
		same( simpleCart.shipping() , 20 , "Flat Rate shipping works");
		
		
		simpleCart({
			shippingQuantityRate: 3
		});
		
		same( simpleCart.shipping() , 20 + 1*3 , "Shipping Quantity Rate works");
		
		simpleCart({
			shippingTotalRate: 0.1
		});
		
		
		same( simpleCart.shipping() , 20 + 1*3 + 0.1*2 , "Shipping Quantity Rate works");
		
		
		simpleCart({
			shippingFlatRate: 0 ,
			shippingQuantityRate: 0 ,
			shippingTotalRate: 0 ,
			taxRate: 0 ,
			shippingCustom: function(){
				return 45;
			}
		});
		
		simpleCart.empty();
		same( simpleCart.shipping() ,  45 , "Custom Shipping works");
		
		simpleCart.add({name:"cool",price:1,shipping:45});
		same( simpleCart.shipping() ,  90 , "item shipping field works");
		
		simpleCart.Item._.shipping = function(){
			if( this.get('name') === 'cool'){
				return 5;
			} else {
				return 1;
			}
		};
		
		simpleCart.empty();
		simpleCart.add({name:'cool',price:2});
		simpleCart.add({name:'bob',price:3});
		simpleCart.add({name:'weird',price:3});
		simpleCart({
			shippingCustom: null
		});
		same( simpleCart.shipping() ,  7 , "Item shipping prototype function works");
		
		
		
		simpleCart.empty();
		simpleCart.add({name:"cool",price:2,taxRate:0.05});
		same( simpleCart.tax() ,  2*0.05 , "Individual item tax rate works");
		
		
		simpleCart.empty();
		simpleCart.add({name:"cool",price:2,tax:1});
		same( simpleCart.tax() ,  1 , "Individual item tax cost works");
		
		simpleCart.empty();
		simpleCart.add({name:"cool",price:2,tax:function(){
			return this.price()*0.1;
		}});
		same( simpleCart.tax() , 0.2, "individual tax cost function works");
		
		simpleCart.empty()
		
	});
	
	
	module('simpleCart.find');
	test("simpleCart.find() function works", function(){
			
		simpleCart.empty();
		var bob = simpleCart.add({name: "bob" , price: 2 , color:'blue' , size: 6 }),
			joe = simpleCart.add({name: "joe" , price: 3 , color:'orange' , size: 3 }),
			jeff = simpleCart.add({name: "jeff" , price: 4 , color:'blue' , size: 4 }),
			bill = simpleCart.add({name: "bill" , price: 5 , color:'red' , size: 5 }),
		
		 	orange_items = simpleCart.find({ color: 'orange' }),
			expensive = simpleCart.find({ price: '>=4' }),
			small = simpleCart.find({ size: '<5' }),
			bob_search = simpleCart.find({ name: "bob" }),
			blue_and_big = simpleCart.find({ color: 'blue', size: '>4' });
			
			
		
			
		
		same( simpleCart.find(bob.id()).id() , bob.id() , "Searching with id works");
		same( orange_items[0].id() , joe.id() , "Searching with string = val works");
		same( expensive[0].id() , jeff.id(), "Searching >= works");
		same( small[0].id() , joe.id(), "Searching < works");
		same( bob_search[0].id() , bob.id(), "Searching by name works");
		same( blue_and_big[0].id() , bob.id(), "Searching on multiple indices works");
				
	});
	
/*	
	module('update view');
	test("cart row input event property" , function(){
		var info = ['size' , 'input'],
			item = {
				  id: 'c9'
				, size: 'small'
			},
			output = simpleCart.createCartRow( info , item , null );
			
		same( output , "<input type=\"text\" value=\"small\" onchange=\"simpleCart.items['c9'].set('size' , this.value);\" />", 'onchange event has expected format' );
	});
	
	
	
	
	
	module('price handling');
	test('non number prices interpretted as 0', function(){
		same( simpleCart.valueToCurrencyString( 'wers' ) , simpleCart.valueToCurrencyString( '0' ) , 'NaN converted to 0 for output');
		
	});
	
	
	module("saving/removing items");
	test('items not overwritten because of duplicate id', function(){
		//simpleCart.empty();
		simpleCart.nextId=99;
		simpleCart.add("name=Bob","price=13.00");
		simpleCart.nextId=99;
		simpleCart.add("name=Joe","price=13.00");
		same( simpleCart.items['c99'].name , "Bob" , "Item not overwritten" );
	});
	
	
	test('return item after adding to cart', function(){
		
		var item = simpleCart.add("name=Jeff","price=14.00");
		same( item.name , "Jeff" , "Name is the same" );
		same( simpleCart.items[ item.id ] , item , "Item accessible by id in simpleCart.items" );
		item.remove();
		same( simpleCart.items[ item.id ] , undefined , "Item removed properly with pointer");
		
	});
	
	test('special characters removed from new item', function(){
		
		var item = simpleCart.add("name=Bill~","price=1422.00");
		same( item.name , "Bill" , "~ removed from new item" );
		item.set( 'name' , "Nick=");
		same( item.name , "Nick" , "= removed from item update" );
		item.set( 'name' , "John~");
		same( item.name , "John" , "~ removed from item update" );
		
	});
	
	
	test('duplicate items increase quantity', function(){
		
		
		var before = 0,
			before_q,
			before_iq,
			after = 0,
		 	item;
		
		item = simpleCart.add("name=Jorge","price=1.00");
		
		simpleCart.each(function(item,x){
			before++;
		});
		before_iq = item.quantity;
		before_q = simpleCart.quantity;
		
		item = simpleCart.add("name=Jorge","price=1.00");
		
		simpleCart.each(function(item,x){
			after++;
		});
		
		same( before , after , "individual item count remains the same" );
		same( simpleCart.quantity , before_q+1, "cart quantity increased" );
		same( item.quantity , before_iq+1, "item quantity increased" );
	});
	
	
	module("updating items");
	test('updates to quantity using item.set() with number value work', function(){
		//simpleCart.empty();
		var item = simpleCart.add("name=Cool Tshirt","price=132.00");
		item.set( 'quantity' , 30 );
		same( item.quantity , 30 , "Quantity with number properly updated" );
	});
	
	test('updates to quantity using item.set() with string value work', function(){
		//simpleCart.empty();
		var item = simpleCart.add("name=Cool Tshirt","price=132.00");
		item.set( 'quantity' , "30" );
		same( item.quantity , 30 , "Quantity with string properly updated" );
	});
	
	

	
	module("language");
	test("change language", function(){
		simpleCart.ln.fake = {
			  quantity: "Bleh"
			, price: "Boom"
			, total: "Pow"
			, decrement: "Crack"
			, increment: "Click"
			, remove: "Snap"
			, tax: "Crash"
			, shipping: "Zoom"
			, image: "Zap"
		};
		
		simpleCart.language = "fake";
		simpleCart.update();
		
		same( simpleCart.print("Price") , "Boom" , "Humanized name translated");
		same( simpleCart.print("price") , "Boom" , "Lower case name translated");
		same( simpleCart.print("Boom")  , "Boom" , "No translation returns input");
		
		
	});
*/
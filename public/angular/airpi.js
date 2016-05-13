var airpi = angular.module('airpiApp', []);
airpi.controller('airpiCntrl', function($scope, $http) {
	
	$scope.submitLogin = function() {
		
		$http({
			method : "POST",
			url : '/checkLogin',
			data : {
				"email" : $scope.emailLogin,
				"password": $scope.password
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else if (data.statusCode == 200){
				window.location.assign('/home');
			} 
		}).error(function(error) {
			
		});
	};
	
	$scope.submitRegister = function() {
		
		$http({
			method : "POST",
			url : '/register',
			data : {
				"firstName" : $scope.firstName,
				"lastName": $scope.lastName,
				"email" : $scope.email,
				"pass": $scope.pass,
				"city" : $scope.city
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else if (data.statusCode == 200){
				window.location.assign('/');
			} 
		}).error(function(error) {
			
		});
	};


	$scope.getResultData = function() {

		$http({
			method : "POST",
			url : '/getResult',
			data : {

			}
		}).success(function(data1) {
			//checking the response data for statusCode
			$scope.searchResult = [];
			console.log(data1.inputData);
			for(var i = 0; i < data1.inputData.length; i++) {
				var city = data1.inputData[i].cityname;
				$.ajax({url: "https://api.breezometer.com/baqi/?start_datetime=" + data1.inputData[i].startdatetime +
				"&end_datetime="+data1.inputData[i].enddatetime+"&interval=12" +
				"&lat=" + data1.inputData[i].latitude +
				"&lon=" + data1.inputData[i].longitude +
				"&key=e90f1d04bc6c4d41ab2b84ecc19ad298",
					success: function(result){
						console.log(result);
						$scope.searchResult.push(result[0]);
						var categories = [];
						var avg = 0.0;
						for(var j = 0; j < result.length; j++){
							avg += result[j].breezometer_aqi;
							var t = {
								"category": result[j].datetime,
								"column-1": result[j].breezometer_aqi
							}
							categories.push(t);
						}
						if(result.length !== 0){
							avg = avg/result.length;
						}
						var content = '<div class="span12 price-column" style="margin-left: 5px; margin-right: 5px;margin-bottom: 20px;">'+
							'<h3>'+city+'</h3>'+
							'<ul class="list">'+
							'<li><div id="chartdiv'+city+'" style="width: 100%; height: 400px; background-color: #FFFFFF;" ></div></li>'+
							'<li class="price" style="color:'+result[0].breezometer_color+';">Avg. AQI: <strong>'+avg+'</strong></li>'+
							'<li style="color: '+result[0].breezometer_color+';"><strong>'+result[0].breezometer_description+'</strong></li>'+
							'<li><strong>Recommendation: </strong>'+result[0].random_recommendations.health+'</li>'+
							'<li><strong>Effect: </strong>'+result[0].dominant_pollutant_text.effects+'</li>'+
							'<li><strong>Causes: </strong>'+result[0].dominant_pollutant_text.causes+'</li>'+
							'</ul>'+
							'</div>';
						$('#result').append(content);


						AmCharts.makeChart("chartdiv"+city,
							{
								"type": "serial",
								"categoryField": "category",
								"angle": 30,
								"depth3D": 30,
								"startDuration": 1,
								"balloonDateFormat": "MM DD, YYYY",
								"columnWidth": 0.5,
								"theme": "default",
								"categoryAxis": {
									"gridPosition": "start"
								},
								"trendLines": [],
								"graphs": [
									{
										"balloonText": "[[title]] of [[category]]:[[value]]",
										"fillAlphas": 1,
										"id": "AmGraph-1",
										"title": "APIs for requested range of dates in 8 hours of interval.",
										"topRadius": 1,
										"type": "column",
										"valueField": "column-1"
									}
								],
								"guides": [],
								"valueAxes": [
									{
										"id": "ValueAxis-1",
										"stackType": "regular",
										"title": "Air Pollution Index"
									}
								],
								"allLabels": [],
								"balloon": {},
								"legend": {
									"enabled": true,
									"useGraphSettings": true
								},
								"titles": [
									{
										"id": "Title-1",
										"size": 15,
										"text": "API in 12 hour Interval"
									}
								],
								"dataProvider": categories
							}
						);


					},
					async: false
				});
			}

		}).error(function(error) {

		});
	};

	
});




import React from 'react';

// First we create our Image class
class Image extends React.Component {
	// Then we add our constructor which receives our props (properties)
	// constructor(props) {
	//     super(props);
	//     // Next we establish our state
	//     this.state = {

	//     }
	//   }


	render() {
	    return (
	      	<div>
	       		<View>
					<img alt="alt text goes here" src="exampleImage.png" />
				</View>
	      </div>
	    )
	  }
	}

}
export default Image;




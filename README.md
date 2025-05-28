# Sender

A lightweight JavaScript library for making HTTP requests with templating support. Sender simplifies API interactions by providing a flexible, chainable interface with built-in template processing.

## Features

- Template-based URL construction
- Support for various request methods (GET, POST, etc.)
- Custom headers support
- Flexible response handling
- Works in both browser and Node.js environments
- AMD/CommonJS/global variable support

## Usage

```javascript
// Initialize
const sender = new Sender();

// Set global variables for templates
sender.vars = {
  apiVersion: 'v1',
  baseUrl: 'https://api.example.com'
};

// Configure common parameters
sender.commons = {
  getParams: {
    token: 'your-auth-token'
  }
};

// Define request presets
sender.presets = {
  getUsers: {
    method: 'get',
    url: '{{baseUrl}}/{{apiVersion}}/users',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

// Make a request using a preset
sender.request('getUsers', {
  callback: function(response) {
    console.log(response.data);
  }
});

// Or make a direct request
sender.request({
  method: 'post',
  url: '{{baseUrl}}/{{apiVersion}}/users',
  headers: {
    'Content-Type': 'application/json'
  }
}, {
  body: { name: 'John Doe' },
  callback: function(response) {
    console.log(response.data);
  }
});
```

## Browser Support

Works in all modern browsers with ES5 support.

## License

Created by Alex Gaivoronski (a.gvrnsk@gmail.com)

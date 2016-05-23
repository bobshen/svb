# svb

Just as a Simple View Binding

## Interface invoke example

```javascript
this.dualBind(
    this.model,
    this.get('controlId'),
    [
        {
            name: 'subUser',
            property: 'value',
            propertyChangeEventType: 'valueChange'
        },
        {
            name: 'subUsers',
            property: 'datasource',
            nameChangeEventType: 'viewmodelchange'
        }
    ],
    {
        modelChangeEventType: 'change',
        controlChangeEventType: 'change',
    }
);
```

```javascript
this.bindModelToControl(
    this.model,
    this.get('controlId'),
    [
        {
            name: 'subUsers',
            property: 'datasource',
            nameChangeEventType: 'viewmodelchange'
        }
    ],
    {
        modelChangeEventType: 'change',
        controlChangeEventType: 'change',
    }
);
```

```javascript
this.bindControlToModel(
    this.model,
    this.get('controlId'),
    [
        {
            name: 'subUser',
            property: 'value',
            propertyChangeEventType: 'valuechange'
        }
    ],
    {
        modelChangeEventType: 'change',
        controlChangeEventType: 'change',
    }
);
```

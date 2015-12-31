/**
 * Leaflet.marker-tool, a plugin that adds control toolbar of multiple markers for
 * Leaflet. This makes it easier to add (different) markers to map. Inspired by
 * Leaflet.draw and best utilized with Leaflet.awesome-markers.
 *
 * @see http://stackoverflow.com/q/5020479
 * @see http://stackoverflow.com/a/2716188
 */
!function(window, document, undefined) {
'use strict';
/*
 * Leaflet.marker-tool assumes that you have already included the Leaflet library.
 */
L.MarkerTool = {};
L.MarkerTool.version = '0.3.0';
/**
 * add control toolbar to the map.
 */
L.MarkerTool.Control = L.Control.extend({
    options: {
        position: 'topleft',
        markers: [
            {
                type: 'marker-bicycle',
                title: 'Bicycle',
                class: 'fa fa-bicycle',
                icon: new L.AwesomeMarkers.Icon({
                    prefix: 'fa',
                    icon: 'fa-bicycle',
                    iconColor: 'white',
                    markerColor: 'red',
                    spin: false,
                    extraClasses: ''
                })
            },
            {
                type: 'marker-cab',
                title: 'Cab',
                class: 'fa fa-cab',
                icon: new L.AwesomeMarkers.Icon({
                    prefix: 'fa',
                    icon: 'fa-cab',
                    iconColor: 'white',
                    markerColor: 'green',
                    spin: false,
                    extraClasses: ''
                })
            },
            {
                type: 'marker-university',
                title: 'University',
                class: 'fa fa-university',
                icon: new L.AwesomeMarkers.Icon({
                    prefix: 'fa',
                    icon: 'fa-university',
                    iconColor: 'white',
                    markerColor: 'black',
                    spin: false,
                    extraClasses: ''
                })
            },
            {
                type: 'marker-coffee',
                title: 'Flag',
                class: 'fa fa-coffee',
                icon: new L.AwesomeMarkers.Icon({
                    prefix: 'fa',
                    icon: 'fa-coffee',
                    iconColor: 'white',
                    markerColor: 'purple',
                    spin: false,
                    extraClasses: ''
                })
            }
        ],
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'marker-tool');
        var toolbar = L.DomUtil.create('div', 'marker-tool-toolbar leaflet-bar');
        var anchor = L.DomUtil.create('a', '');
        var markerHandler = new L.MarkerTool.Handler(map);
        for (var i in this.options.markers) {
            var link = anchor.cloneNode();
            link.href = '#add-marker';
            link.title = this.options.markers[i].title;
            link.dataset.markerIndex = i;
            L.DomUtil.addClass(link, this.options.markers[i].class);
            L.DomEvent.addListener(link, 'click', function(e) {
                L.DomEvent.preventDefault(e);
                L.DomEvent.stopPropagation(e);
                markerHandler.setNewMarker(
                    this.options.markers[e.target.dataset.markerIndex]
                );
            }, this);
            toolbar.appendChild(link);
        }
        container.appendChild(toolbar);
        return container;
    }
});

/**
 * handles setting up the marker on the map when the toolbar marker is clicked.
 */
L.MarkerTool.Handler = L.Handler.extend({

    _map: null,
    _marker: null,

    options: {
        type: 'marker-default',
        icon: new L.Icon.Default()
    },

    setNewMarker: function(marker) {
        if ( !this.enabled()) {
            L.Util.setOptions(this, {
                type: marker.type,
                icon: marker.icon
            });
            this.enable();
        }
    },

    addHooks: function() {
        L.DomEvent.on(this._map._container, 'keyup', this._cancelOnEsc, this);
        this._map.on('mousemove', this._onMouseMove, this);
        this._map.on('click', this._onClick, this);
    },

    removeHooks: function() {
        L.DomEvent.off(this._map._container, 'keyup', this._cancelOnEsc, this);
        this._map.off('mousemove', this._onMouseMove, this);
        this._map.off('click', this._onClick, this);
        this._map.removeLayer(this._marker);
        this._marker = null;
    },

    _onMouseMove: function(e) {
        if ( !this._marker) {
            this._marker = new L.Marker(e.latlng, {
                icon: this.options.icon
            });
            this._marker.addTo(this._map);
        }
        this._marker.setLatLng(e.latlng);
    },

    _onClick: function() {
        this._fireMarkerAddedEvent();
        this.disable();
    },

    _fireMarkerAddedEvent: function() {
        this._map.fire('marker:added', {
            layer: new L.Marker(this._marker.getLatLng(), {
                icon: this.options.icon
            }),
            layerType: this.options.type
        });
    },

    // cancel placing the marker if escape key is pressed.
    _cancelOnEsc: function(e) {
        if (e.keyCode === 27) {
            this.disable();
        }
    }
});

L.MarkerTool.control = function(options) {
    return new L.MarkerTool.Control(options);
}

}(window, document);
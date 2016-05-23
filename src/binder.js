/**
 * Simple View Binder
 * Copyright (C) 2016 ShenBin
 * Released under the MIT License.
 *
 * @file Binder
 * @author shenbin(bobshenbin@gmail.com)
 */

const VIEW_CHANGE_EVENT_TYPE = Symbol('change');
const DEFAULT_BIND_CONFIG = {
    modelChangeEventType: 'change',
    controlChangeEventType: 'change'
};

/**
 * Observe the control change,
 * then delegate the new change event with change informations to original control change event.
 *
 * @param {Control} control Control instance
 * @param {Array} bindings binding relations config
 * @param {Object} config global binding config
 */
function observeControl(control, bindings, config) {
    for (let binding of bindings) {
        let propertyChangeEventType = binding.propertyChangeEventType || config.controlChangeEventType;

        control.on(
            propertyChangeEventType,
            e => control.delegate(
                control,
                control,
                VIEW_CHANGE_EVENT_TYPE,
                {
                    change: {
                        controlId: control.id,
                        property: binding.property,
                        newValue: e.target.get(binding.property)
                    }
                }
            )
        );
    }
}

/**
 * Sync model data with control property
 *
 * @param {Model} model Model instance
 * @param {Control} control Control instance
 * @param {Array} bindings binding relations config
 * @param {Object} config global binding config
 */
function syncModelWithControl(model, control, bindings, config) {
    // Sync `Model` data with `Control` property when control changed
    for (let binding of bindings) {
        control.on(
            VIEW_CHANGE_EVENT_TYPE,
            e => {
                let change = e.change.controlId === control.id && e.change.property === binding.property
                    ? e.change
                    : null;

                if (change) {
                    model.set(binding.name, change.newValue);
                }
            }
        );
    }
}

/**
 * Sync control property with model data
 *
 * @param {Model} model Model instance
 * @param {Control} control Control instance
 * @param {Array} bindings binding relations config
 * @param {Object} config global binding config
 */
function syncControlWithModel(model, control, bindings, config) {
    // Sync `Control` property with `Model` data when model changed
    for (let binding of bindings) {
        let nameChangeEventType = binding.nameChangeEventType || config.modelChangeEventType;

        model.on(
            nameChangeEventType,
            e => {
                let change = e.change.name === binding.name ? e.change : null;

                if (change) {
                    control.set(binding.property, change.newValue);
                }
            }
        );
    }
}

/**
 * Provide an approach to bind the control property with the Model data.
 * Use this under the development libs contains:
 *
 * - `esui` like UI Lib that envelops the UI logic, and provides the similar interface
 * - `er` like MVC Lib that has View and Model abstraction, and provides the similat interface
 */
export default {

    /**
     * Single bind the Model data and control property,
     * sync the `Control` property when `Model` data changed.
     *
     * @method binder.bindModelToControl
     * @param {Model} model Model instance
     * @param {Control} control Control instance
     * @param {Array} bindings binding relations config
     * @param {Object} [config={}] global binding config
     */
    bindModelToControl(model, control, bindings, config = {}) {
        config = {...DEFAULT_BIND_CONFIG, config};

        // Sync `Control` property with `Model` data
        syncControlWithModel(model, config, bindings, config);
    },

    /**
     * Single bind the Model data and control property,
     * sync the `Model` data when `Control` property changed.
     *
     * @method binder.bindControlToModel
     * @param {Model} model Model instance
     * @param {Control} control Control instance
     * @param {Array} bindings binding relations config
     * @param {Object} [config={}] global binding config
     */
    bindControlToModel(model, control, bindings, config = {}) {
        config = {...DEFAULT_BIND_CONFIG, config};

        // Observe the control changes, envelop the all change events to unified `View change`
        observeControl(control, bindings, config);

        // Sync `Model` data with `Control` property
        syncModelWithControl(model, config, bindings, config);
    },

    /**
     * Dual bind the Model data and the control property,
     * let the both data be synchronous.
     *
     * @method binder.dualBind
     * @param {Model} model Model instance
     * @param {Control} control Control instance
     * @param {Array} bindings binding relations config
     * @param {Object} [config={}] global binding config
     */
    dualBind(model, control, bindings, config = {}) {
        config = {...DEFAULT_BIND_CONFIG, config};

        // Observe the control changes, envelop the all change events to unified `View change`
        observeControl(control, bindings, config);

        // Sync `Model` data with `Control` property
        syncModelWithControl(model, control, bindings, config);
        // Sync `Control` property with `Model` data
        syncControlWithModel(model, control, bindings, config);
    }
};

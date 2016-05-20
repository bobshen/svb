/**
 * Simple View Binder
 * Copyright (C) 2016 ShenBin
 * Released under the MIT License.
 *
 * @file View Binder
 * @author shenbin(bobshenbin@gmail.com)
 */

/**
 * Provide an approach to bind the control property with the ViewModel.
 * Use this under the development libs contains:
 *
 * - `esui` like UI Lib that envelops the UI logic, and provides the similar interface
 * - `er` like MVC Lib that has View and Model abstraction, and provides the similat interface
 *
 * Use the view binder as a decorator for any ViewModel class,
 * then generate a new Class that you could use it to bind the control property and ViewModel.
 *
 * @param {Class} target target class
 * @return {Class} Higher-order Class
 */
export default target => class extends target {

    /**
     * Observe the control changes
     *
     * @protected
     * @method viewBinder.observeControl
     * @param {string} controlId 控件id
     * @param {string} controlProperty 控件属性名
     * @param {string} eventType 事件类型
     */
    observeControl(controlId, controlProperty, eventType) {
        this.getSafely(controlId).on(
            eventType,
            e => this.fire(
                'change',
                {
                    change: {
                        controlId: controlId,
                        controlProperty: controlProperty,
                        value: e.target.get(controlProperty)
                    }
                }
            )
        );
    }

    /**
     * Single bind the viewModel and control property,
     * synchronous the both data.
     *
     * @public
     * @method viewBinder.singleBind
     * @param {string} name ViewModel属性名
     * @param {string} controlId 控件id
     * @param {string} controlProperty 控件属性名
     */
    singleBind(name, controlId, controlProperty) {
        // `ViewModel` 的变化同步至 `Control`
        this.model.on(
            'viewmodelchange',
            e => {
                let change = e.change.name === name ? e.change : null;

                if (change) {
                    this.getSafely(controlId).set(controlProperty, change.newValue);
                }
            }
        );
    }

    /**
     * Dual bind the ViewModel and the control property,
     * synchronous the both data.
     *
     * @public
     * @method viewBinder.dualBind
     * @param {string} name ViewModel属性
     * @param {string} controlId 控件id
     * @param {string} controlProperty 控件属性名
     * @param {string} [eventType='change'] 事件类型
     */
    dualBind(name, controlId, controlProperty, eventType = 'change') {
        // 观察 `Control` 的变化
        this.observeControl(controlId, controlProperty, eventType);

        // `Control` 的变化同步至 `ViewModel`
        this.on(
            'change',
            e => {
                if (e.change.controlId === controlId && e.change.controlProperty === controlProperty) {
                    this.model.set(name, e.change.value);
                }
            }
        );

        // `ViewModel` 的变化同步至 `Control`
        this.singleBind(name, controlId, controlProperty);
    }
};

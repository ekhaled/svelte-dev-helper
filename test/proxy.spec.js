import { createProxy, Registry } from '../index';

/* global describe, it */
const chai = require('chai');
const sinonChai = require('sinon-chai');
const { spy } = require('sinon');
const devHelper = require('../index');
const Component = require('./fixtures/mockComponent').default;

chai.use(sinonChai);
const { expect } = chai;

describe('Config', function() {

  devHelper.configure({ x: 'y' });

  it('allows configuration', function() {
    let config = devHelper.getConfig();
    expect(config.noPreserveState).to.be.false;

    devHelper.configure({ noPreserveState: true });
    config = devHelper.getConfig();
    expect(config.noPreserveState).to.be.true;

    devHelper.configure({ noPreserveState: true });
  });

});

describe('Proxy', function() {

  const id = 'fixtures/MockComponent.html';

  const SpiedComponent = spy(Component);

  Registry.set(id, {
    rollback: null,
    component: SpiedComponent,
    instances: []
  });

  const Wrapped = createProxy(id),
    wrappedComponent = new Wrapped({});

  it('should contain the right component and instance in Registry', function() {
    const item = Registry.get(id);
    expect(item.component).to.eq(SpiedComponent);
    expect(item.instances[0]).to.eq(wrappedComponent);
  });

  it('Underlying component gets constructed when proxy is constructed', function() {
    expect(SpiedComponent).to.be.calledOnce;
    expect(wrappedComponent.proxyTarget).to.be.instanceOf(SpiedComponent);
  });

  it('wrapped component contains right props', function() {

    '_fragment,_slotted,root,store'.split(',')
      .forEach((prop) => {
        expect(wrappedComponent[prop]).not.to.be.undefined;
        expect(wrappedComponent[prop]).to.eq(wrappedComponent.proxyTarget[prop]);
      });

    expect(wrappedComponent._debugName).to.eq('<MockComponent>');
    expect(wrappedComponent.id).to.eq(id);

  });

  it('wrapped component contains right methods', function() {

    'get,fire,observe,on,set,teardown,_recompute,_set,_mount,_unmount,destroy,_register,_rerender'.split(',')
      .forEach((prop) => {
        expect(typeof wrappedComponent[prop]).to.eq('function');
      });

  });

  it('removes itself from Registry on destruction', function() {
    wrappedComponent.destroy(true, true);
    const item = Registry.get(id);
    expect(item.component).to.eq(SpiedComponent);
    expect(item.instances[0]).to.be.undefined;
    expect(item.instances.length).to.eq(0);
  });

});
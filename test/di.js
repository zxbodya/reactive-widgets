import di from '../src/di';

di.provide(10, ()=>10);
di.provide(11, (ten)=>ten + 1, 10);
di.provide(21, (ten, eleven)=>ten + eleven, 10, 11);

describe('DI Container', function () {
  let injector;

  beforeEach(()=> {
    injector = new di.Injector();
  });

  it('resolves simple dependencies', ()=> {
    injector.provide(1, ()=>1);
    injector.provide(2, ()=>2);
    injector.provide(3, (one, two)=>one + two, 1, 2);

    expect(injector.get(3)).toBe(3);
  });

  it('throws for non existing token', ()=> {
    expect(()=>injector.get(1)).toThrow(new Error('provider not found'));
  });

  it('throws for cyclic dependencies', ()=> {
    injector.provide(1, ()=>1, 2);
    injector.provide(2, ()=>2, 1);
    expect(()=>injector.get(1)).toThrow(new Error('cyclic dependency'));
  });

  it('caches instance after creation', ()=> {
    injector.provide(1, ()=> {
      return {};
    });

    expect(injector.get(1)).toEqual(injector.get(1));
  });

  it('uses provide from parent injector', ()=> {
    injector.provide(1, ()=>1);

    let child = injector.createChild();
    child.provide(2, (one)=>one + 1, 1);

    expect(child.get(2)).toEqual(2);
  });


  it('overrides provides from parent injector with provides from child', ()=> {
    injector.provide(1, ()=>1);

    let child = injector.createChild();
    child.provide(1, ()=>2);
    child.provide(3, (one)=>one + 1, 1);

    expect(child.get(3)).toEqual(3);
  });


  it('uses default provides', ()=> {
    expect(injector.get(10)).toBe(10);
    expect(injector.get(11)).toBe(11);
    expect(injector.get(21)).toBe(21);
  });

  it('reuses instances from parent injector', ()=> {
    let cnt = 0;

    injector.provide(1, ()=> {
      cnt += 1;
      return {};
    });

    let child = injector.createChild();
    injector.get(1);
    child.get(1);

    expect(cnt).toEqual(1);
  });

  it('do not reuse instances from parent injector, if one of dependencies is overridden', ()=> {
    let cnt = 0;
    injector.provide(3, ()=>3);
    injector.provide(1, ()=> {
      cnt += 1;
      return {};
    }, 3);

    let child = injector.createChild();
    injector.get(1);
    child.provide(3, ()=>4);
    child.get(1);
    expect(cnt).toEqual(2);
  });

  it('allows to add new default providers after Injector was created', ()=> {
    di.provide(12, ()=>12);
    expect(injector.get(12)).toEqual(12);
  });

  it('should return itself when Injector instance is required', ()=> {
    expect(injector.get(di.Injector)).toEqual(injector);
    let child = injector.createChild();
    expect(child.get(di.Injector)).toEqual(child);
    child.provide('injectorId', id=>id, di.Injector);
    expect(child.get('injectorId')).toEqual(child);
  });

  it('should use "latest" injector when instantiating with injector dependency', ()=> {
    injector.provide('injectorId', id=>id, di.Injector);
    let child = injector.createChild();
    expect(child.get('injectorId')).toEqual(child);
  });

});

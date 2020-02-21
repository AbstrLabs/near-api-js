// Unit tests for simple util code

const nearlib = require('../../lib/index');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

test.each`
    balance                              | fracDigits   | expected
    ${'8999999999837087887'}             | ${undefined} | ${'0.000008999999999837087887'}
    ${'8099099999837087887'}             | ${undefined} | ${'0.000008099099999837087887'}
    ${'999998999999999837087887000'}     | ${undefined} | ${'999.998999999999837087887'}
    ${'1'+'0'.repeat(13)}                | ${undefined} | ${'0.00000000001'}
    ${'9999989999999998370878870000000'} | ${undefined} | ${'9,999,989.99999999837087887'}
    ${'000000000000000000000000'}        | ${undefined} | ${'0'}
    ${'1000000000000000000000000'}       | ${undefined} | ${'1'}
    ${'999999999999999999000000'}        | ${undefined} | ${'0.999999999999999999'}
    ${'999999999999999999000000'}        | ${10}        | ${'1'}
    ${'1003000000000000000000000'}       | ${3}         | ${'1.003'}
    ${'3000000000000000000000'}          | ${3}         | ${'0.003'}
    ${'3000000000000000000000'}          | ${4}         | ${'0.003'}
    ${'3500000000000000000000'}          | ${3}         | ${'0.004'}
    ${'03500000000000000000000'}         | ${3}         | ${'0.004'}
    ${'10000000999999997410000000'}      | ${undefined} | ${'10.00000099999999741'}
    ${'10100000999999997410000000'}      | ${undefined} | ${'10.10000099999999741'}
    ${'10040000999999997410000000'}      | ${2}         | ${'10.04'}
    ${'10999000999999997410000000'}      | ${2}         | ${'11'}
    ${'1000000100000000000000000000000'} | ${undefined} | ${'1,000,000.1'}
    ${'1000100000000000000000000000000'} | ${undefined} | ${'1,000,100'}
    ${'910000000000000000000000'}        | ${0}         | ${'1'}
`('formatNearAmount($balance, $fracDigits) returns $expected', ({ balance, fracDigits, expected }) => {
    expect(nearlib.utils.format.formatNearAmount(balance, fracDigits)).toEqual(expected);
});

test.each`
    amt                               | expected
    ${null}                           | ${null}
    ${'5.3'}                          | ${'5300000000000000000000000'}
    ${'5'}                            | ${'5000000000000000000000000'}
    ${'1'}                            | ${'1000000000000000000000000'}
    ${'10'}                           | ${'10000000000000000000000000'}
    ${'0.000008999999999837087887'}   | ${'8999999999837087887'}
    ${'0.000008099099999837087887'}   | ${'8099099999837087887'}
    ${'999.998999999999837087887000'} | ${'999998999999999837087887000'}
    ${'0.000000000000001'}            | ${'1000000000'}
    ${'0.000001'}                     | ${'1000000000000000000'}
    ${'.000001'}                      | ${'1000000000000000000'}
    ${'000000.000001'}                | ${'1000000000000000000'}
    ${'1,000,000.1'}                  | ${'1000000100000000000000000000000'}
`('parseNearAmount($amt) returns $expected', ({ amt, expected }) => {
    expect(nearlib.utils.format.parseNearAmount(amt)).toEqual(expected);
});

test('parseNearAmount fails when parsing values with ≥25 decimal places', () => {
    expect(() => {
        nearlib.utils.format.parseNearAmount('0.0000080990999998370878871');
    }).toThrowError(
        'Cannot parse \'0.0000080990999998370878871\' as NEAR amount'
    );
});

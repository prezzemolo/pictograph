const assert = require('assert')
const pictograph = require('..')

describe('pictograph', () => {
    describe('decode', () => {
        // ':+1:'
        it(`should return '👍' when the value is ':+1:'`, () => {
            assert.equal(
                pictograph.decode(':+1:'),
                '👍'
            )
        })

        // ':+5000000000000:'
        it(`should return ':+5000000000000:' when the value is ':+5000000000000:'`, () => {
            assert.equal(
                pictograph.decode(':+5000000000000:'),
                ':+5000000000000:'
            )
        })

        // ':100: :+1: :-1: :+5000000000000:'
        it(`should return '💯 👍 👎 :+5000000000000:' when the value is ':100: :+1: :-1: :+5000000000000:'`, () => {
            assert.equal(
                pictograph.decode(':100: :+1: :-1: :+5000000000000:'),
                '💯 👍 👎 :+5000000000000:'
            )
        })

        // 'lgtm :+1:'
        it(`should return 'lgtm 👍' when the valus is 'lgtm :+1:'`, () => {
            assert.equal(
                pictograph.decode('lgtm :+1:'),
                'lgtm 👍'
            )
        })

        // 'yo'
        it(`should return 'yo' when the value is 'yo'`, () => {
            assert.equal(
                pictograph.decode('yo'),
                'yo'
            )
        })

        // null
        it(`should return null when the value is null`, () => {
            assert.equal(
                pictograph.decode(null),
                null
            )
        })
    })
})

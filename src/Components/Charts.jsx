import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

function Charts({ chartData} ) {
    return (
        <>
            <ResponsiveContainer width = "100%" height = {300} >
                <LineChart data = {chartData}>
                    <CartesianGrid strokeDasharray= "3 3" />
                    <XAxis 
                        dataKey = "date"
                        reversed = {true}
                    />
                    <YAxis
                        tickFormatter = {(tick) => `$${Math.round(tick)}`}
                        domain = {['auto', 'auto']}
                    />
                    <Legend />
                    <Line 
                        type = "monotone"
                        dataKey = "close"
                        stroke = "#82ca9d"
                        name = "Close Price"
                    />
                </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width = "100%" height = {300}>
                <BarChart data = {chartData}>
                    <XAxis dataKey = "date" reversed = {true} />
                    <YAxis
                    tickFormatter = {(tick) => {
                        if (tick >= 1000000) return `${(tick / 1000000).toFixed(1)}M`;
                        if (tick >= 1000) return `${(tick / 1000).toFixed(1)}K`;
                        return tick;
                    }}
                    />
                    <Legend/>
                    <Bar dataKey = "volume" fill = "#f44336" name = "Volume"/>
                </BarChart>
            </ResponsiveContainer>
        </>

        
        
        
    );
}

export default Charts;